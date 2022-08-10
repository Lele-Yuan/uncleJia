<template>
    <div class="video-wrapper">
        <div class="face-wrap">
            <!-- video用于显示媒体设备的视频流，自动播放 -->
            <video id="video" autoplay style="width: 480px; height: 320px;" />
        </div>
        <div class="canvas-wrap">
            <!-- 描绘video截图 -->
            <h1>Canvas Info</h1>
            <canvas id="canvas" width="480" height="320"></canvas>
            <div id="imgTip">{{state.imgTip}}</div>
            <el-button type="default" v-if="!state.streamClosed" @click="closeStream">关闭摄像头</el-button>
            <el-button v-if="state.streamClosed" @click="openStream">打开摄像头</el-button>
        </div>
        <div class="pic-wrap">
            <h1>Img Info</h1>
            <!-- canvas 转换成 img -->
            <div id="imgView">
                <img :src="state.imageSrc" alt="">
            </div>
            <!-- 错误提示，用于移动端观察 -->
            <h1>Error Info</h1>
            <div id="errorTip">{{state.errorTip}}</div>
            <!-- 设备信息 -->
            <h1>Device Info</h1>
            <div id="device" style="text-align: center;">{{state.deviceText}}</div>
        </div>
    </div>
</template>
<!-- <script src="https://cdn.jsdelivr.net/gh/eduardolundgren/tracking.js/build/tracking-min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/eduardolundgren/tracking.js/build/data/face-min.js"></script> -->
<script lang="ts" setup>
import { defineComponent, reactive, toRefs } from 'vue';

        const state = reactive({
            errorTip: '',
            imgTip: '正在检测人脸……',
            deviceText: '',
            videoSrc: '',
            streamIns: null as any, // 视频流
            tipFlag: 0,
            flag: 0,
            streamClosed: false,
            imageSrc: '',
            tracker: null as any
        });
        const appendScript = (scriptUrl: string) => {
            const createScript = document.createElement('script');
            createScript.src = scriptUrl;
            document.body.appendChild(createScript);
            return new Promise((resolve: any) => {
                createScript.onload = function() {
                    resolve();
                };
            })
        }

        const success = (stream: any) => {
            state.streamIns = stream
            //兼容webkit内核浏览器
            const CompatibleURL = window.URL || window.webkitURL;
            const video = document.getElementById('video') as any;
            //将视频流设置为video元素的源
            try {
                video.src = CompatibleURL.createObjectURL(stream);
                // 播放视频
                video.play();
            } catch (e: any) {
                video.srcObject = stream;
                // throw new Error(e);
            }
        };

        const error = (error: {name: string, message: string}) => {
            state.errorTip = '访问用户媒体设备失败：' + error;
            throw new Error("访问用户媒体设备失败：" + error.name + error.message);
        };

        const getUserMedia = (constrains: {video: any}, success: any, error: any) => {
            if(navigator.mediaDevices.getUserMedia){
                //最新标准API
                navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
            } else if ((navigator as any).webkitGetUserMedia){
                //webkit内核浏览器
                (navigator as any).webkitGetUserMedia(constrains).then(success).catch(error);
            } else if ((navigator as any).mozGetUserMedia){
                //Firefox浏览器
                (navigator as any).mozGetUserMedia(constrains).then(success).catch(error);
            } else if ((navigator as any).getUserMedia){
                //旧版API
                (navigator as any).getUserMedia(constrains).then(success).catch(error);
            }
        };

        const initSetting = () => {
            if (navigator.mediaDevices.getUserMedia
                || (navigator as any).getUserMedia
                || (navigator as any).webkitGetUserMedia
                || (navigator as any).mozGetUserMedia
            ) {
                //调用用户媒体设备，访问摄像头
                getUserMedia({
                    video: {
                        width: 1920,
                        height: 1080,
                        facingMode: "user" // 前置优先
                    }
                }, success, error);
            } else {
                state.errorTip = '你的浏览器不支持访问用户媒体设备';
                alert("你的浏览器不支持访问用户媒体设备");
            }
        };
        
        const handleTracked = (event: any) => {
            const canvas = document.getElementById("canvas") as any;
            const context = canvas.getContext("2d");
            const video = document.getElementById("video") as any;
            const imgView = document.getElementById("imgView") as any;
            window.plot = function({x, y, width: w, height: h}: {x: number, y: number, width: number, height: number}) {
                // 创建框对象
                const rect = document.createElement('div');
                (document.querySelector('.face-wrap') as any).appendChild(rect);
                rect.classList.add('rect');
                rect.style.width = w + 'px';
                rect.style.height = h + 'px';
                rect.style.left = (video.offsetLeft + x) + 'px';
                rect.style.top = (video.offsetTop + y) + 'px';

                // 显示追踪点到页面上
                state.deviceText = "x:" + x + "y:" + y + "h:" +h + "w:" + w;
            };
            if (event.data.length === 0) {
                // 没有检测到
                console.log('没有检测到人脸');
            } else {
                // 提示用户已经检测到人脸
                if(!state.tipFlag) {
                    state.imgTip = '检测人脸成功，正在拍照，请保持不动2秒！';
                }
                
                // 1秒后拍照，仅拍一次
                if(!state.flag) {
                    state.flag = 1;
                    setTimeout(() => {
                        // 模拟btn点击事件
                        //绘制画面
                        context.drawImage(video, 0, 0, 480, 320);
                        // 保持图片为base64格式
                        const imgUrl = canvas.toDataURL("image/png");
                        // 显示图片
                        state.imageSrc = canvas.toDataURL("image/png");
                        state.imgTip = '拍照完成！';
                        state.tipFlag = 1
                        removeTracker();
                    }, 1000);
                }
                
                // 人脸数据点阵处理
                event.data.forEach(window.plot)
            }
        };
        const initTracker = () => {
            // 新建一个tracker实例
            state.tracker = new window.tracking.ObjectTracker(['face']); // 可选 face, eye, mouth, 需要引入相应的js
            
            // 设置步长
            state.tracker.setStepSize(1.7);
            
            // 绑定监听方法
            state.tracker.on('track', handleTracked);
            
            // 开始追踪
            window.tracking.track('#video', state.tracker);

            const SECOND = 1000
            // 10s后移除监听
            setTimeout(() => {
            }, 60 * SECOND);
        };
        const removeTracker = () => {
            state.errorTip = '移除追踪';
            state.tracker.removeListener('track', handleTracked);
        }

        const init = async () => {
            await appendScript('https://cdn.jsdelivr.net/gh/eduardolundgren/tracking.js/build/tracking-min.js');
            await appendScript('https://cdn.jsdelivr.net/gh/eduardolundgren/tracking.js/build/data/face-min.js');
            initSetting();
            initTracker();
        }

        // 关闭摄像
        const closeStream = () => {
            state.errorTip = "我点击了关闭；视频流对象：" + state.streamIns
            try {
                state.streamIns.enabled = false;
                state.streamIns.getTracks()[0].stop();
                state.streamIns.getVideoTracks()[0].stop();
                state.streamClosed = true;
            } catch(e: any) {
                throw new Error(e);
            }
        }
        
        // 开启摄像
        const openStream = () => {
            window.location.reload()
        }

        init();

</script>

<style lang="less" scoped>
.video-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    .face-wrap {
        position: relative;
        /deep/ .rect {
            border: 2px solid #a64ceb;
            left: -1000px;
            position: absolute;
            top: -1000px;
            z-index: 1100;
        }
    }
}
</style>
