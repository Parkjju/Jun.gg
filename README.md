# JUN.GG

## Intorduction

-   OP.GG를 클론 코딩한 프로젝트입니다.

## Content

-   [Requirements](#Requirements)
-   [Installation](#Installation)
-   [Features](#Features)
-   [Challenges](#Challenges)
-   [Todo](#Todo)

## Requirements

-   [Riot Developer Portal](https://developer.riotgames.com/)에 로그인 후 API Key를 발급받습니다. `.gitignore` 목록에 `secret.json`이라는 이름으로 API 키를 담아 관리하므로 프로젝트 클론 후 `secret.json` 파일에 `data`라는 변수명으로 API key를 저장합니다.

```json
data={"key":"API KEY"}
```

-   API key를 담는 변수 자체는 전역적으로 관리 되어 콘솔 창에서 출력할 수 있지만, 외부 서버에 배포하지 않는 프로젝트이므로 깃헙 상에만 API key를 업로드 하지 않으면 됩니다.

-   크롬 기반입니다.

## Installation

```sh
git clone https://github.com/Parkjju/Jun.gg.git
```

## Features

-   유저 검색
-   유저 정보
-   최근 20경기 정보
    -   KDA, 챔피언 이미지, 팀 정보 등

## Learn

### axios

-   액시오스 라이브러리를 사용하는 과정에서 한 매치 데이터를 `get`요청 보낸 후 액시오스 체이닝을 통해 또 다시 여러 요청들을 보내는 과정이 필요했습니다. 이때 배열을 선언하고 배열 각 원소를 `axios.get`요청을 보낸 프라미스 객체로 `push`해두고 이 이터러블 객체를 `axios.all` 메서드를 통해 한꺼번에 요청에 대한 응답처리를 진행하였습니다.

### Javascript

-   데이터 fetch와 비동기 처리에 대한 이해가 기초적으로 이루어졌습니다.

-   각종 DOM 조작에 대해 익숙해질 수 있었습니다.

-   fetch 받은 데이터 렌더링을 위한 여러 로직 처리들을 경험해볼 수 있었습니다.

## Todo

-   [ ] API 요청 제한으로 인해 `setTimeout`을 설정하였는데, 네트워크 패널을 보니 요청에 대한 응답을 통해 `onload` 이벤트는 진작에 이루어진 상황이었습니다. 액시오스 각 요청에 제한시간을 두는 것을 앞으로 서치해볼 예정입니다.

-   [ ] 순수 자바스크립트, CSS로만 이루어진 스택을 좀 더 발전시켜 React, SCSS 등을 적용시켜볼 예정입니다.

-   [ ] 매치 세부데이터를 추가할 예정입니다. (매치 대상 아이템 트리 등)

-   [ ] 챔피언 숙련도 관련 데이터 추가 예정입니다.

-   [ ] Node.JS 적용을 통해 백엔드 단에서 데이터가 어떻게 주고 받아지는지 학습해볼 예정입니다. 현재는 로컬에서만 돌아가도록 하기 위해 크롬의 `localStorage`를 이용하고 있습니다.
