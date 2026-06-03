// 날씨/시간 테마별 앰비언스 사운드를 Web Audio API로 절차적 합성한다.
// 음원 파일 없이 자기완결. 브라우저에서만 인스턴스화할 것 (AudioContext 의존).

export type AmbientScene = "day" | "night" | "rain" | "snow";

interface SceneNodes {
  output: GainNode;
  stop: () => void;
}

export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private current: { scene: AmbientScene; nodes: SceneNodes } | null = null;
  private targetVolume = 0.5;
  private started = false;

  private ensure(): AudioContext {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.targetVolume;
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  // 2초 루프 화이트노이즈 버퍼 (빗소리·바람용)
  private createNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private buildScene(scene: AmbientScene): SceneNodes {
    const ctx = this.ensure();
    const out = ctx.createGain();
    out.gain.value = 0; // 페이드인 위해 0에서 시작
    out.connect(this.master as GainNode);
    const cleanup: Array<() => void> = [];

    if (scene === "rain" || scene === "snow") {
      // 노이즈 기반 (비/바람)
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(ctx);
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      if (scene === "rain") {
        filter.type = "bandpass";
        filter.frequency.value = 1200;
        filter.Q.value = 0.7;
      } else {
        filter.type = "lowpass";
        filter.frequency.value = 480;
      }

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = scene === "rain" ? 0.5 : 0.34;
      noise.connect(filter).connect(noiseGain).connect(out);

      // 느린 변조 (빗줄기 세기 / 바람 결)
      const lfo = ctx.createOscillator();
      lfo.frequency.value = scene === "rain" ? 0.3 : 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = scene === "rain" ? 0.16 : 0.12;
      lfo.connect(lfoGain).connect(noiseGain.gain);

      noise.start();
      lfo.start();
      cleanup.push(() => {
        noise.stop();
        lfo.stop();
      });
    } else {
      // 오실레이터 패드 (낮: 밝은 화음 / 밤: 낮고 잔잔한 화음)
      const freqs =
        scene === "night" ? [110, 164.81, 220] : [220, 277.18, 329.63];

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;

        const gain = ctx.createGain();
        gain.gain.value = 0.12 / (i + 1);

        // 느린 비브라토로 생동감
        const vibrato = ctx.createOscillator();
        vibrato.frequency.value = 0.08 + i * 0.02;
        const vibratoGain = ctx.createGain();
        vibratoGain.gain.value = freq * 0.003;
        vibrato.connect(vibratoGain).connect(osc.frequency);

        osc.connect(gain).connect(out);
        osc.start();
        vibrato.start();
        cleanup.push(() => {
          osc.stop();
          vibrato.stop();
        });
      });
    }

    return {
      output: out,
      stop: () => cleanup.forEach((fn) => fn()),
    };
  }

  // 현재 사운드를 새 scene으로 크로스페이드
  setScene(scene: AmbientScene) {
    if (!this.started) return;
    const ctx = this.ensure();
    const now = ctx.currentTime;
    const FADE = 1.2;

    if (this.current) {
      const old = this.current.nodes;
      old.output.gain.cancelScheduledValues(now);
      old.output.gain.setValueAtTime(old.output.gain.value, now);
      old.output.gain.linearRampToValueAtTime(0, now + FADE);
      window.setTimeout(() => old.stop(), (FADE + 0.2) * 1000);
    }

    const next = this.buildScene(scene);
    next.output.gain.setValueAtTime(0, now);
    next.output.gain.linearRampToValueAtTime(1, now + FADE);
    this.current = { scene, nodes: next };
  }

  async start(scene: AmbientScene) {
    const ctx = this.ensure();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    this.started = true;
    this.setScene(scene);
  }

  stop() {
    if (this.current) {
      this.current.nodes.stop();
      this.current = null;
    }
    this.started = false;
    if (this.ctx && this.ctx.state === "running") {
      void this.ctx.suspend();
    }
  }

  setVolume(volume: number) {
    this.targetVolume = Math.max(0, Math.min(1, volume));
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(
        this.targetVolume,
        this.ctx.currentTime,
        0.1
      );
    }
  }

  get isStarted() {
    return this.started;
  }
}
