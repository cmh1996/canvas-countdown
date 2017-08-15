var CANVAS_WIDTH = 1024;
var CANVAS_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

var endTime = new Date();
endTime.setTime(endTime.getTime()+(3600*1000));//一小时倒计时
var curShowTimeSeconds = 0;

var balls=[];
var colors=["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function(){
    var canvas = document.getElementById('countdown');
    var cxt = canvas.getContext('2d');

    CANVAS_HEIGHT = document.body.clientHeight;
    CANVAS_WIDTH = document.body.clientWidth;
    MARGIN_TOP = Math.round(CANVAS_HEIGHT/5);
    MARGIN_LEFT = Math.round(CANVAS_WIDTH/10);
    RADIUS = Math.round(CANVAS_WIDTH*4/5/108)-1;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    curShowTimeSeconds = getCurShowTimeSeconds();
    
    setInterval(function(){
        render(cxt);
        update();
    },50)
}


//得到截止时间离现在的秒数
function getCurShowTimeSeconds(){
    var now = new Date();
    var ret = endTime.getTime() - now.getTime();
    ret = Math.round(ret/1000);
    return ret>=0 ? ret:0;
}

//判断是否需要更新
function update(){
    var nextShowTimeSeconds = getCurShowTimeSeconds();
    var n_h = parseInt(nextShowTimeSeconds/3600);
    var n_m = parseInt(nextShowTimeSeconds-n_h*3600)/60;
    var n_s = nextShowTimeSeconds%60;
    
    var c_h = parseInt(curShowTimeSeconds/3600);
    var c_m = parseInt(curShowTimeSeconds-c_h*3600)/60;
    var c_s = curShowTimeSeconds%60;

    if(nextShowTimeSeconds != curShowTimeSeconds){
        //依次判断数字是否有改变
        if(parseInt(n_h/10)!=parseInt(c_h/10)){
			addballs(MARGIN_LEFT,MARGIN_TOP,parseInt(n_h/10));
		};
		if(parseInt(n_h%10)!=parseInt(c_h%10)){
			addballs(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(n_h%10));
		};
		if(parseInt(n_m/10)!=parseInt(c_m/10)){
			addballs(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(n_m/10));
		};
		if(parseInt(n_m%10)!=parseInt(c_m%10)){
			addballs(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(n_m%10));
		};
		if(parseInt(n_s/10)!=parseInt(c_s/10)){
			addballs(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(n_s/10));
		};
		if(parseInt(n_s%10)!=parseInt(c_s%10)){
			addballs(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(n_s%10));
        };
        
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
}

//绘制渲染
function render(cxt){
    cxt.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    var h = parseInt(curShowTimeSeconds/3600);
    var m = parseInt(curShowTimeSeconds-h*3600)/60;
    var s = curShowTimeSeconds%60;

    //从左到右依次绘制数字和冒号
    renderDigit(MARGIN_LEFT,
                MARGIN_TOP,
                parseInt(h/10),
                cxt);
    renderDigit(MARGIN_LEFT+15*(RADIUS+1),
                MARGIN_TOP,
                parseInt(h%10),
                cxt);
    renderDigit(MARGIN_LEFT+30*(RADIUS+1),
                MARGIN_TOP,
                10,
                cxt);
    renderDigit(MARGIN_LEFT+39*(RADIUS+1),
                MARGIN_TOP,
                parseInt(m/10),
                cxt);
    renderDigit(MARGIN_LEFT+54*(RADIUS+1),
                MARGIN_TOP,
                parseInt(m%10),
                cxt);
    renderDigit(MARGIN_LEFT+69*(RADIUS+1),
                MARGIN_TOP,
                10,
                cxt);
    renderDigit(MARGIN_LEFT+78*(RADIUS+1),
                MARGIN_TOP,
                parseInt(s/10),
                cxt);
    renderDigit(MARGIN_LEFT+93*(RADIUS+1),
                MARGIN_TOP,
                parseInt(s%10),
                cxt);


    //画小球
    for(var i=0;i<balls.length;i++){
        cxt.fillStyle=balls[i].color;
        cxt.beginPath();
        cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
        cxt.closePath();
        cxt.fill();
    }
}

//画圈圈
function renderDigit(x,y,num,cxt){
    cxt.fillStyle = 'rgb(0,102,153)';

    for(var i=0;i<digit[num].length;i++){//找到对应数字
        for(var j=0;j<digit[num][i].length;j++){//遍历每一个数字中的每一行
            if(digit[num][i][j] === 1){//如果该元素是1，就画个圆
                cxt.beginPath();
                cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),
                        y+i*2*(RADIUS+1)+(RADIUS+1),
                        RADIUS,
                        0,
                        2*Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }
    }
}

//增加小球
function addballs(x,y,num){
    for(var i=0;i<digit[num].length;i++)
        for(var j=0;j<digit[num][i].length;j++)
            if(digit[num][i][j]==1){
                var newball={
                    x : x+(RADIUS+1)+j*2*(RADIUS+1),
                    y : y+(RADIUS+1)+i*2*(RADIUS+1),
                    g : 1.5+Math.random(),
                    vx :Math.pow(-1,Math.floor(Math.random()*100))*5,
                    vy : -Math.ceil(Math.random()*10),
                    color :colors[Math.floor(Math.random()*colors.length)]
                }
                balls.push(newball);
            }
}

//更新小球动作
function updateBalls(){
    //（重力加速度，边际处理）
    for(var i=0;i<balls.length;i++){
        balls[i].x +=balls[i].vx;
        balls[i].y +=balls[i].vy;
        balls[i].vy +=balls[i].g;
        if(balls[i].y> CANVAS_HEIGHT - RADIUS){
            balls[i].y=CANVAS_HEIGHT -RADIUS;
            balls[i].vy=-balls[i].vy*0.6;
        }
    }

    //超出画面的小球将被清理，节省内存
    var cnt = 0;
    for(var i=0;i<balls.length;i++){
        if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS<CANVAS_WIDTH){
            balls[cnt++] = balls[i];
        }
    }
    while(balls.length>Math.min(300,cnt)){
        balls.pop();
    }
}