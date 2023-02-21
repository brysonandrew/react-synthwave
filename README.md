<p align="center">
  <img src="https://github.com/brysonandrew/react-synthwave/blob/main/assets/logo.png?raw=true" width="50" height="50" alt="Framer Motion Icon" />
  
</p>
<h1 align="center">React Synthwave</h1>
<h3 align="center">
 Play synth sounds using Web Audio oscillators
</h3>

### 📚 Docs

#### Hooks

- useSynthSingle

Will play a single oscillator each time play is called

- input: 
  - context: AudioContext,
  - options: TSynthOptions
    - output:
      - play:
        - input:
          - options: TSynthOptions
        - output: void
      - stop:
        - input:
          - options: TStopOptions
        - output: void

```jsx
import { useSynthSingle } from "react-synthwave";

const synth = useSynthSingle(context, options);

return {
  <div>
    <button onClick={() => synth.play({attack: 0.2})}>
     ▷
    </button>
    <button onClick={() => synth.stop({delay: 0.2})}>
      ▣
    </button>
  </div>
}
```

- useSynthMulti

Will play multiple oscillators over the top of each other.

- input:
  - context: AudioContext
  - synthOptions: TSynthOptions
    - output:
      - play:
        - input:
          - multiOptions: TMultiOptions | TMultiOptions[]
        - output: void
      - stop:
        - input:
          - options: TStopOptions
        - output: void

```jsx
import { useSynthMulti } from "react-synthwave";

const synth = useSynthMulti(context, options);

return {
  <div>
    <button onClick={() => synth.play({midi: 28})}>
     ▷
    </button>
    <button onClick={() => synth.stop({end: context.currentTime + 5})}>
      ▣
    </button>
  </div>
}
```

### 👩🏻‍⚖️ License

- React Synthwave is MIT licensed.
