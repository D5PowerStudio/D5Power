module d5power
{
    export class BaseEffects
    {
        private static _vertexSrc:String = [
            "attribute vec2 aVertexPosition;\n",
            "attribute vec2 aTextureCoord;\n",
            "attribute vec2 aColor;\n",

            "uniform vec2 projectionVector;\n",

            "varying vec2 vTextureCoord;\n",
            "varying vec4 vColor;\n",

            "const vec2 center = vec2(-1.0, 1.0);\n",

            "void main(void) {\n",
            "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n",
            "   vTextureCoord = aTextureCoord;\n",
            "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n",
            "}"
        ].join("\n");
        private static _flashEff:egret.CustomFilter;

        /**
         * 流光特效
         */
        public static get flashEff():egret.CustomFilter
        {
            if(this._flashEff==null)
            {
                let fragmentSrc=[
                    "precision lowp float;\n",
                    "varying vec2 vTextureCoord;\n",
                    "varying vec4 vColor;\n",
                    "uniform sampler2D uSampler;\n",
                    "uniform float customUniform;\n",
                    "void main(void) {\n",
                    "vec2 uvs = vTextureCoord.xy;\n",
                    "vec4 fg = texture2D(uSampler, vTextureCoord);\n",
                    "if(fg.a>float(0)){\n",
                    "fg.rgb += sin(customUniform + uvs.x * 2. + uvs.y * 2.) * 0.2;\n",
                    "gl_FragColor = fg * vColor;\n",
                    "}else{\n",
                    "gl_FragColor = fg;\n",
                    "}",
                    "}"
                ].join("\n");
                this._flashEff = new egret.CustomFilter(this._vertexSrc,fragmentSrc,{customUniform:0});
            }
            return this._flashEff;
        }

        /**
         * 流光特效运行方法
         */
        public static runFlashEff():void{
            if(this._flashEff)
            {
                this._flashEff.uniforms.customUniform += 0.1;
                if (this._flashEff.uniforms.customUniform > Math.PI * 2) this._flashEff.uniforms.customUniform = 0.0;
            }
        }
    }
}