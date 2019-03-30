module d5power{
	export class RandMapConf {
		/**摇杆半径*/
		public static rocker_bar_sensitivity:number = 120;
		/**游戏里一分钟对应现实的毫秒数*/
		public static game_time_t_my:number = 1000;
		/**单元格宽度 */
		public static GRID_W:number = 200;
		/**单元格高度 */
		public static GRID_H:number = 100;
		/**横向预加载格子数量 */
		public static OFFSET_W:number = 400;
		/**纵向预加载格子数量 */
		public static OFFSET_H:number = 100;
		/**植被存储横向像素 */
		public static ROOM_CHECK_W:number = 2000;
		/**植被存储纵向像素 */
		public static ROOM_CHECK_H:number = 1000;
		/**植被的树 */
		public static ROOM_GRID_SIZE:number = 300;
		/**世界的高度 */
		public static WORD_W:number = 200000;
		/**世界的宽度 */
		public static WORD_H:number = 100000;
		public static map_cfx:number;//世界缩放比例
		public static map_cfy:number;//世界缩放比例
		/**是否显示迷雾 */
		public static showFog:boolean = false;
		/**是否显示河流 */
		public static showRiver:boolean = false;

	}
}