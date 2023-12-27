# react-native boilerplate

현업에서 react-native를 사용한 경험을 담은 boilerplate로,
프로젝트 구조, 사용한 프레임워크 및 라이브러리 사용 이유, 장단점을 다룬 repository입니다

---

#### react-native를 선택한 이유

react 개발자로 입사해, mobile application 개발을 담당하게 되었고, android 뿐 아니라 ios 개발도 동시에 진행했어야 했기에 사용하게 되었습니다

---

#### 프로젝트 실행

android studio emulator, xcode ximulator 설정 후,

- yarn install
- android
  - yarn android (.env) - 환경에 따라 env를 설정합니다
    - yarn android:dev (.env.dev)
    - yarn android:prod (.env.prod)
- ios - 현 프로젝트는 환경에 따른 스키마 설정이 되어있지 않습니다
  - yarn ios
    - yarn ios:dev (.env.dev)
    - yarn ios:prod (.env.prod)

---

#### 프로젝트 배포
- android
  - apk build: yarn android:apk
  - aab build: yarn android:aab
- ios
  - xcode에서 any IOS devices 선택 후, archive

---

#### 프로젝트 생성

React-native-cli (with Typescript)

expo로 빌드하는 것보다, react-native-cli를 이용하여 직접 설정 해보고, 네이티브 단에서 필요한 개발이 있을 수도 있다고 판단해 선택하였습니다

안전하고, 협업 시 수월한 개발을 위하여 typescript로 함께 설정하였습니다

---

#### 프로젝트 구조

```bash
💼src
├── 📂api
│   ├── 📃index.ts // axios interceptor 설정
│   ├── ...
├── 📂app
│   ├── 📃store.ts // redux store 설정
├── 📂assets
│   ├── 📂images
│   │   ├── ...
├── 📂common
│   ├── 📃common.ts // 공통으로 사용되는 utils
├── 📂components
│   ├── 📂atoms // 원자 단위의 컴포넌트
│   │   ├── ...
│   ├── 📂orgainsms // atoms 혼합 컴포넌트
│   │   ├── ...
├── 📂styles // 공통 css style
│   │   ├── ...
│   │   ├── 📃Mixin.ts // 공통 styled-compoent
│   │   ├── 📃theme.ts // 공통 css color, fontSize
├── 📂features
│   ├── ...
├── 📂navigations
│   ├── 📂bottomTabs // bottomTabs
│   │   ├── 📃index.tsx
├── 📂stacks // Stack.Navigator 모음
├── 📃RootTab.tsx // auth에 따른 tab stack 구분
├── 📃Screen.tsx // Screen custom
│   ├── ...
├── 📂reducers // redux reducer slice
│   ├── ...
├── 📃App.tsx
├── 📃.env // local test env
├── 📃.env.dev // dev server env
├── 📃.env.prod // prod server env
```
