import { gsap } from "gsap"
import { ExpoScaleEase, RoughEase, SlowMo } from "gsap/EasePack";
import './style/normalize.css'
import './style/main.css'
gsap.registerPlugin(ExpoScaleEase, RoughEase, SlowMo);

import './js/RunPixieRun'
