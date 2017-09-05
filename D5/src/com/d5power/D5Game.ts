module d5power {
    export class D5Game {
        /**
         * 游戏中的每“米”对应程序中的像素值
         */ 
        public static MI:number = 50;
        /**
         * 游戏资源服务器，留空则为本地素材相对路径
         */ 
        public static RES_SERVER:string = '';
        /**
         * 游戏资源的保存目录
         */ 
        public static ASSET_PATH:string = 'resource/';

        public static screenWidth:number = 1280;

        public static screenHeight:number = 800;

        public static timer:number = 0;

        public static FPS:number = 45;
    }
}