//모듈을 파일로 만듬 => require()를 이용하여 추출가능 ex) const AppTest = require('../appTest')

/*
module.exports = function(){
	return 'hello';
}
*/

module.exports = {
    sayHello: function(){
        return 'hello'
    },
    addNumbers: function(value1, value2){
        return value1 + value2
    }
}