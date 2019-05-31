import moment from 'moment-timezone'
import Compressor from 'compressorjs'
import queryString from 'query-string'

export default class ComUtil {


    /*******************************************************
     두날짜 비교해서, 같은지 작은지 큰지 return
     @Param : sDate 일자(yyyy-mm-dd) : String
     @Return :
     -1: sDate1 < sDate2
     0 : sDate1 == sDate2
     1 : sDate1 > sDate2
     *******************************************************/
    static compareDate(sDate1, sDate2) {

        let date1 = this.getDate(sDate1);
        let date2 = this.getDate(sDate2);

        let dt1 = ((date1.getTime()/3600000)/24);
        let dt2 = ((date2.getTime()/3600000)/24);

        if (dt1 === dt2) return 0;
        if (dt1 < dt2) return -1;
        else return 1;
    }

    static getDate(strDate){
        let dateTo = strDate.replace(new RegExp('-', 'g'), '');

        let pYear 	= dateTo.substr(0,4);
        let pMonth 	= dateTo.substr(4,2) - 1;
        let pDay 	= dateTo.substr(6,2);

        return new Date(pYear, pMonth, pDay);
    }

    /*******************************************************
     날짜 연산 함수 - 날짜 더하기 빼기
     예) addDate('2019-01-05', 5) =>  returns 2019-01-10
        addDate('2019-01-06', -5) =>  returns 2019-01-01
     */
    static addDate(strDate, date) {
        let inputDate = this.getDate(strDate);

        inputDate.setDate( inputDate.getDate() + date);

        let returnDate = inputDate.getFullYear() + '-' + this.zeroPad(inputDate.getMonth() + 1) + '-' + this.zeroPad(inputDate.getDate())

        //console.log(returnDate);
        return returnDate;

    }

    /*******************************************************
     UTC 날짜타입 => String 변환
     @Param : utcTime, formatter
     @Return : yyyy-MM-dd (formatter 형식에 맞게 반환)
     *******************************************************/
    static utcToString(utcTime, formatter) {

        const format = formatter ? formatter : "YYYY-MM-DD"

        const utcDate = moment(utcTime);
        return utcDate.tz(moment.tz.guess()).format(format)

        /*
        var d = new Date(utcTime);

        // UTC version of the date
        var yyyy = d.getUTCFullYear();
        var mmUTC = this.zeroPad(d.getUTCMonth() + 1);
        var ddUTC = this.zeroPad(d.getUTCDate());
        var hhUTC = this.zeroPad(d.getUTCHours());
        let minUTC = this.zeroPad(d.getUTCMinutes());

        return yyyy + '-' + mmUTC + '-' + ddUTC + ' ' + hhUTC + ':' + minUTC;
        */
    }

    /*******************************************************
     날짜 및 시간-10보다 작은 숫자 호출시 앞에 0 format
     @Param : number
     @Return : number
     *******************************************************/
    static zeroPad(number) {
        if (number < 10) return '0' + number;
        else return number;
    }

    /**
     * 현재시간을 UTCTime으로 가져오기
     */
    static getNow() {
        return new Date().getTime();
    }

    /*******************************************************
     날짜 포맷 세팅
     @Param : time
     @Return : yyyy-MM-ddThh:mm:00(년-월-일T시간:분:초)
     *******************************************************/
    static setDate(time) {
        let date = new Date();
        //return date.getFullYear() + '-' + this.zeroPad(date.getMonth() + 1) + '-' + this.zeroPad(date.getDate()) + 'T' + time + ":00";
        const localDate = date.getFullYear() + '-' + this.zeroPad(date.getMonth() + 1) + '-' + this.zeroPad(date.getDate()) + 'T' + time + ":00";

        return moment.tz(localDate, moment.tz.guess()).format()
    }

    /*******************************************************
     숫자에 comma 추가
     @Param : 1234567
     @Return : 1,234,567
     *******************************************************/
    static addCommas(number) {
        if (number === undefined ) {
            return;
        }
        return number.toLocaleString();
    }

    /*******************************************************
     시간에 분 추가
     @Param : dt, minutes
     @Return :
     *******************************************************/
    static addMinutes(dt, minutes) {
        return new Date(dt.getTime() + minutes*60000)
    }

    /*******************************************************
     이미지 파일을 받아 압축율을 적용
     @Param : { file, opacity }
     @Return : file
     *******************************************************/
    static imageCompressor({file, quality}) {
        return new Compressor(file, {
            quality: !quality && 0.6,       //압축률
            success(result) {},
            error(err) {
                console.log(err.message);
            },
        }).file;
    }

    /*******************************************************
     배송시작일 표시용 날짜 포맷
     @Param : yyyy-MM-dd(date)
     @Return : MM/dd(요일)
     *******************************************************/
    static simpleDate(date) {
        var week = ['일', '월', '화', '수', '목', '금', '토'];
        var dayOfWeek = week[new Date(date).getDay()];
        return date.substring(5,7) + '/' + date.substring(8,10) + '(' + dayOfWeek + ')';
    }

    /*******************************************************
     밸리데이션용 함수(밸리데이션 체크에 걸렸을 경우 alert()을 띄워주며 걸린 키와 함께 결과값을 반환 합니다)
     @Param : 검증할 object, 밸리데이션 체크 해야할 키 Array(key, msg)
     @Return : {result: true or false, inavlidKey: '밸리데이션 체크에 걸린 키'}
     @Usage :

        const data = {name:'jaden', age: null, cell: '010-6679-0080'};

        const validArr = [
                 {key: 'name', msg: '성명'},
                 {key: 'age', msg: '나이'}
             ]

        validate(data, validArr)
     *******************************************************/
    static validate(data, validationArr) {

        let invalidKey;
        let result = true;

        for (let i = 0; i < validationArr.length; i++) {
            const vObj = validationArr[i];
            const key = vObj.key;

            console.log(key in data);

            if (key in data == false) {
                console.log(`${key} 는 data 필드에 에 없습니다.`);
                invalidKey = key;
                result = false;
                break;
            }

            const value = data[key];

            if (!value) {
                alert(vObj.msg + '를 입력해 주세요');
                invalidKey = key;
                result = false;
                break;
            }

            let type = typeof value;

            if (type === 'string') {
                if (value.length <= 0) {
                    alert(vObj.msg + '를 입력해 주세요')
                    invalidKey = key;
                    result = false;
                    break;
                }
            }
            else if (type === 'number') {
                if (value <= 0) {
                    alert(vObj.msg + '를 입력해 주세요')
                    invalidKey = key;
                    result = false;
                    break;
                }
            }
            else if (type === 'object') {
                if (Array.isArray(value)) {
                    if (value.length <= 0) {
                        alert(vObj.msg + '를 입력해 주세요')
                        invalidKey = key;
                        result = false;
                        break;
                    }

                }
            }
        }
        return {result: result, inavlidKey: invalidKey};
    }

    /*******************************************************
     오브젝트의 attribute들의 value들을 copy,
     @Param : target - 타겟 오브젝트, copy가 필요한 attribute가 존재해야 함
     source - 소스 오브젝트
     *******************************************************/
    static objectAttrCopy(target, source) {
        for (let key in target) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];  //value만 copty
            }
        }
    }

    /*******************************************************
     email 확인 정규식(ㅁㅁㅁ@ㅁㅁㅁ.co.kr/com 형식)
     @Param : (string)
     @Return : true/false
     *******************************************************/
    static emailRegex(email) {
        var emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

        return emailRule.test(email)
    }

    /*******************************************************
     valword 형식 확인 정규식(8~16자 영문자, 숫자, 특수문자 필수포함)
     @Param : (string)
     @Return : true/false
     *******************************************************/
    static valwordRegex(valword) {
        var valRule = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

        return valRule.test(valword)
    }

    /*******************************************************
     숫자만 입력 정규식
     @Param : Number
     @Return : true/false
     *******************************************************/
    static onlyNumber(number) {
        var onlyNumber = /[^0-9]/g;

        return !onlyNumber.test(number)
    }

    /*******************************************************
     쿼리스트링을 파상하여 object 로 반환
     @Param : props
     @Return : object
     *******************************************************/
    static getParams(props) {
        return queryString.parse(props.location.search)
    }

    /*******************************************************
     현재부터 미래 날짜 사이의 시간차를 구하여 포맷에 맞게 반환
     @Param : Number(Millisecond), string
     @Return : string
     *******************************************************/
    static getDateDiffTextBetweenNowAndFuture(date, formatter){
        const format = formatter || 'DD[일] HH[시] mm[분] ss[초]';
        const future  = moment(date);
        const now = moment();
        return moment.utc(moment(future,"YYYY-MM-DD HH:mm:ss").diff(moment(now,"YYYY-MM-DD HH:mm:ss"))).format(format)

    }

    /*******************************************************
     array object 를 정렬하여 반환
     @Param : array object, string(정렬 할 key), bool(desc 여부)
     @Return : array object
     *******************************************************/
    static sort = (rowData, key, isDesc) => {
        let desc = isDesc || true

        return rowData.sort((a, b) => {
            if (desc)
                return b[key] - a[key]
            else
                return a[key] - b[key]
        })
    }
    static isWebView() {

        console.log(navigator.userAgent);

        if (navigator.userAgent.startsWith('BloceryApp')) {
            return true;
        }
        return false;
    }

    //price3Step - 알파서비스 전용, 1번상품에 대해 3단계 가격정책 적용.
    /**
     * @param goods
     *         사용필드 reservationPrice - 최종예약판매가
     *                saleEnd - 판매마감일자 :UTC date
     * @Return: 3단계 가격 array [{toDate:YYYY-MM-DD,price:1단계가격}, {toDate:YYYY-MM-DD, price:2단계 가격}, {toDate:YYYY-MM-DD, price:3단계 가격}]
     */
    static price3StepAll(goods) {

        let saleEndStr = this.utcToString(goods.saleEnd);

        let price1 = {toDate:this.addDate(saleEndStr,-14), price: Math.floor(goods.reservationPrice * 0.6) };  //60% 가격
        let price2 = {toDate:this.addDate(saleEndStr,-7), price: Math.floor(goods.reservationPrice * 0.75) }; //75% 가격
        let price3 = {toDate:saleEndStr, price:goods.reservationPrice}; //3단계 최종예약판매가.

        let returnArray =[];
        returnArray.push(price1,price2,price3);

        return returnArray;
    }
    /**
        3step가격 중 오늘의 가격 리턴.
        오늘이 toDate1보다 작거나 같으면 price1 리턴
        오늘이 toDate1보다 크고 toDate2보다 작거나같으면 price2 리턴
        오늘이 toDate2보다 크면 price3 리턴.
     */
    static price3StepCurrent(goods) {

        let today = this.getNow(); //UTC time.
        let todayStr = this.utcToString(today); //YYYY-MM-DD

        const price3all = this.price3StepAll(goods);

        if (this.compareDate(todayStr, price3all[0].toDate) <= 0 ) return price3all[0].price;

        if (this.compareDate(todayStr, price3all[0].toDate) > 0 &&
            this.compareDate(todayStr, price3all[1].toDate) <= 0 ) return price3all[1].price;

        return price3all[2].price;
    }
}