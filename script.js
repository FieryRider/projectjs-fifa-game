let result = document.getElementById("result");

Ajax.get('http://worldcup.sfg.io/teams/', function(response) {
    console.log(response)
})
