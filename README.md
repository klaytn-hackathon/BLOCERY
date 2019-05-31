

#### working dApp
https://play.google.com/store/apps/details?id=com.blocery  (for Android)

http://blocery.com (for iPhone)

#### website for information

http://blocery.io 


### FrontEnd (react.js)

1. npm 설치. https://nodejs.org/en/ ⇒  LTS버전 설치
  
   
2. npm install:  package.json수정시 및 최초구동시  /react-frontend폴더 밑에서 $ npm install  (필요 library들 다운로드 . node_modules폴더로)
3. npm start:    실행- /react-frontend$ npm start   ==> loalhost:3000으로 자동접속
    (가끔 빌드가 필요하면      $npm run build) 

4. UI: bootstrap4의 react버전인 reactstrap을 적용테스트 중.
링크의 우측메뉴에서 예쁜 Component골라서 쓰기 -  http://reactstrap.github.io/components/navbar/


### BackEnd (springBoot)

1. JDK1.8  설치
2. IntelliJ에 Lombok plugin설치  (Lombok은 java class의 setter/getter를 자동으로 생성해주는 plugin) 
    - (Preference세팅메뉴) 의 plugins 서브메뉴에서 Lombok plugin 검색설치
    - (Preference세팅메뉴)  compiler->annotation processor에서 Enable Annotation Processor선택 

3. 실행법 :

   * Run Configuration에서 ChainApplication골라서 실행 (하고나면 우측상단에서 버튼실행도 가능)
   * 혹은 좌측Tree에서 ChainApplication골라서 context Menu로 실행 
   * 혹은 터미널에서 "gradle bootRun" 커맨드로 실행

 => 실행되면 SPRING 로고가 크게 보이면서 tomcat으로 http://localhost:8080 에서 backend서비스가 됨.

* 추가: mongoDB 로컬 설치(mongo 클라이언트 이용시 필요)
    - window용 : http://solarisailab.com/archives/1605 참조
    - mac용: $ brew install mongodb
* 확인 
    - $ mongod  - 설치 후 db서버 실행하는 명령어임
    - 초기data넣기 :  웹브라우저에서 localhost/dbtest   입력하면 test데이타 입력됨
    - $ mongo - 커맨드로 db 접속해서 db.user.find() 명령어로 확인가능

### SmartContract (solidity /truffle)

1. 설치

   * $ (sudo) npm install -g truffle@4.1.14  로 설치
   * /truffle폴더 npm install
   * ganache(로컬 test용 이더리움) 설치  http://truffleframework.com/ganache/

2. truffle 업그레이드   
   * \$sudo npm uninstall -g truffle
   * \$sudo npm install -g truffle
   
   truffle 폴더에서
   * \$rm -rf node_modules
   * \$npm instal   
  
3. 실행

   * (/truffle폴더 밑에서)  $ truffle compile 로 컴파일해서
   * (/truffle폴더 밑에서)  $ truffle migrate (--reset) 으로 deploy.

4. truffle test 
   * \$sudo npm install -g ganache-cli   
   * \$ ganache-cli -p 7545 -l 100000000 (가나쉬 구동)

  => sol개발 완료 및 compile 후에, build/contracts 밑에 xxContract.json파일이 생성되면, 이파일을 /react-frontend/public 밑으로 복사해서 dApp개발.

### 폰용dApp (react-native  /userPhone)
  - android의 경우 안드로이드 스튜디오에서 에물레이터 구동
  
  - android 스튜디오에서 userPhone/android import 필요->gradle update 됨
 
  - $adb reverse tcp:8080 tcp:8080 로 해야 폰에서 localhost:8080으로 매핑됨.
  
  - $adb reverse tcp:3000 tcp:3000 로 해야 폰에서 localhost:3000으로 매핑됨.
  
  - $ react-native run-android
  
  - $react-native log-android 로 일부로그 조회가능.(console.log도 나옴)
  - (외부 라이브러리 사용시 $react-native link 필요)
  
  - WebView는 react-natvie의 WebView사용 중, 향후 react-native-webview로 변경검토 필요

