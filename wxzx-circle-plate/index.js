// component/wxzx-circle-plate/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  properties: {
    startAngle:{
      type:Number,
      value: -Math.PI / 2, // 起始角度
    }, 
    lastAngle:{
      type: Number,
      value: -Math.PI / 2, // 终止角度
    }, 

    touchCircleR:{
      type: Number,
      value: 8, // 触摸圆的半径
    },

    touchCircleColor:{
      type: String,
      value: '#EFF2F5',// 触摸圆颜色
    }, 
    isCanTouch: {
      type: Boolean,
      value: false, // 是否相应触摸事件
    },
    touchCircleR: {
      type: Number,
      value: 8, // 触摸圆的半径
    },
    circleR: {
      type: Number,
      value: 70, // 指定轨道上出现触摸圆，
    },
    progressValue: {
      type: Number,
      value: 0, // 当前进度
    },
    circleCenterX: {
      type: Number,
      value: 150, // 大圆圆心坐标X轴
    },
    circleCenterY: {
      type: Number,
      value: 150, // 大圆圆心坐标Y轴
    },
    circleCenterR: {
      type: Number,
      value: 100, // 大圆圆心半径
    },
    circleCenterColor:{
      type:String,
      value: '#EDF0F3',// 大圆圆环颜色
    }, 
    circleCenterWidth:{
      type:Number,
      value: 4,// 大圆圆环宽度
    }, 
    progressCircleColor: {
      type:String,
      value: '#269073',// 进度圆环颜色
    },
    progressCircleWidth:{
      type:Number,
      value: 6,// 进度圆环宽度
    }, 
    gearWheelDefaultColor: {
      type: String,
      value: '#DCDFE0',// 齿轮默认颜色
    }, 
    gearWheelActiveColor: {
      type: String,
      value: 'rgba(38, 144, 115, 1)',// 齿轮激活颜色
    }, 
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    // 绘制外圈
    whiteRedCircle: function (context) {
      context.save();
      context.beginPath();
      context.lineWidth = this.data.circleCenterWidth; //设置线宽
      context.strokeStyle = this.data.circleCenterColor;
      context.arc(this.data.circleCenterX, this.data.circleCenterY, this.data.circleCenterR, 0, Math.PI * 2, false);
      context.stroke();
      context.closePath();
      context.restore();
    },

      // 绘制齿轮
      drawGearWheel: function (context, rateNum){
        context.translate(this.data.circleCenterX, this.data.circleCenterY);
          context.save();
          let hasOver = parseInt(rateNum * 100);
          for (let i = 0; i < 100; i++) {
              context.beginPath();
              context.setLineWidth(1);
              if (i > hasOver) {
                context.setStrokeStyle(this.data.gearWheelDefaultColor);
                  context.moveTo(0, -110);
              } else if (i >= hasOver - 2 && i <= hasOver + 1) {
                context.setStrokeStyle(this.data.gearWheelActiveColor);
                  context.moveTo(0, -115);
              } else {
                  context.moveTo(0, -110);
                context.setStrokeStyle(this.data.gearWheelActiveColor);
              }

              context.lineTo(0, -95);
              context.stroke();
              context.rotate(3.6 * Math.PI / 180);
          }
      },

    // 绘制触摸圆
    drawTouchCirclr: function (context, rateNum) {
      context.save();
      context.beginPath();
      context.lineWidth = this.data.touchCircleR * 2; //设置线宽
      context.strokeStyle = this.data.touchCircleColor;
      context.arc(this.data.circleCenterX + this.data.circleR * Math.sin(rateNum * Math.PI * 2), this.data.circleCenterY - this.data.circleR * Math.cos(rateNum * Math.PI * 2), this.data.touchCircleR, 0, Math.PI * 2, false);
      context.stroke();
      context.closePath();
      context.restore();
    },

    //绘制进度外圈
    drawWhiteCircle: function (context, n) {
      context.save();
      context.strokeStyle = this.data.progressCircleColor; //设置描边样式
      context.lineWidth = this.data.progressCircleWidth; //设置线宽
      context.beginPath(); //路径开始
      context.arc(this.data.circleCenterX, this.data.circleCenterY, this.data.circleCenterR, this.data.startAngle, this.data.startAngle + n * Math.PI * 2, false); //用于绘制圆弧           context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
      context.stroke(); //绘制
      context.closePath(); //路径结束
      context.restore();
    },

    // 写文字
    drawText: function (ctx, str) {
      ctx.setFontSize(20);
      ctx.setTextAlign('center');
      let rel = parseInt((this.data.startAngle + str * Math.PI * 2 + Math.PI / 2) * 100 / (2 * Math.PI));
      let showText = rel + '%';
      ctx.fillText(showText, this.data.circleCenterX, 20);
    },

    // 重绘canvas
    drawInit(rateNum) {
      const ctx = wx.createCanvasContext('credit-canvas',this);
      this.drawText(ctx, rateNum);
      // this.whiteRedCircle(ctx);
      // this.drawWhiteCircle(ctx, rateNum);
      this.drawTouchCirclr(ctx, rateNum);
      this.drawGearWheel(ctx,rateNum);
      ctx.draw();
      this.setData({
          progressValue: rateNum,
          lastAngle:360*rateNum
      });
    },

    // 计算角度
    canculateRate: function (newX, newY) {
      const MathX = Math.abs(newX - this.data.circleCenterX);
      const MathY = Math.abs(newY - this.data.circleCenterY);
      if (MathX == 0 || MathY == 0) {
        return;
      }
      // 计算移动终点相对圆心转过的角度
      let angle;
      if (newX > this.data.circleCenterX && newY < this.data.circleCenterY) {//第一象限
        angle = Math.atan(MathX / MathY) * 180 / Math.PI;
      } else if (newX >= this.data.circleCenterX && newY >= this.data.circleCenterY) {// 第二象限
        angle = 180 - Math.atan(MathX / MathY) * 180 / Math.PI;
      } else if (newX <= this.data.circleCenterX && newY >= this.data.circleCenterY) {//第三象限
        angle = 180 + Math.atan(MathX / MathY) * 180 / Math.PI;
      } else { // 第四象限
        angle = 360 - Math.atan(MathX / MathY) * 180 / Math.PI;
      }

      if (angle - this.data.lastAngle > 180) {// 当为零届点向左移动
        angle = 0;
      } else if (angle - this.data.lastAngle < -180) {// 当为临届点向右移动
        angle = 360;
      }
      // 转动的进度
      let rateNum = angle / 360;

      this.drawInit(rateNum);

      this.setData({
        progressValue: rateNum,
        lastAngle: angle
      });

    },

    // 触摸结束方法
    handletouchmove: function (event) {
      if (this.data.isCanTouch) {
        this.canculateRate(event.changedTouches[0].x, event.changedTouches[0].y);
        let detail = event.changedTouches;
        let option = {};
        this.triggerEvent('handletouchmove', detail, option);
      }
    },

    // 触摸开始方法
    handleTouchStart: function (event) {
      let x = event.touches[0].x;
      let y = event.touches[0].y;

      let touchCircleX = 150 + this.data.circleR * Math.sin(this.data.progressValue * Math.PI * 2);
      let touchCircleY = 150 - this.data.circleR * Math.cos(this.data.progressValue * Math.PI * 2);

      if (touchCircleX + this.data.touchCircleR * 2 < x || x < touchCircleX - this.data.touchCircleR * 2 || touchCircleY + this.data.touchCircleR * 2 < y || y < touchCircleY - this.data.touchCircleR * 2) {
        this.setData({
          isCanTouch: false
        });
      } else {
        this.setData({
          isCanTouch: true,
        });
      }
    }
  }
})
