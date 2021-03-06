var config = {
    star_r : 3,
    star_alpha : 5,
    initStarsPopulation : 150,
    move_distance : 0.25,
    dot_r : 5,
    dot_speeds : 0.5,
    dot_alpha : 0.5,
    dot_aReduction : 0.01,
    dotsMinDist : 5,
    maxDistFromCursor : 50,
};
let canvas = null;
let ctx = null;
function Star(id, x, y, useCache) {
    
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    this.id = id;
    this.x = x;
    this.y = y;
    this.useCacha = useCache;
    this.cacheCanvas = document.createElement("canvas");
    this.cacheCtx = this.cacheCanvas.getContext("2d");
    this.r = Math.floor(Math.random() * config.star_r) + 1;
    this.cacheCtx.width = 6 * this.r;
    this.cacheCtx.height = 6 * this.r;
    var alpha = ( Math.floor(Math.random() * 10) + 1) / config.star_alpha;
    this.color = "rgba(255,255,255," + alpha + ")";
    if (useCache) {
        this.cache()
    }
}

Star.prototype = {
    draw : function () {
        if (!this.useCacha) {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.r * 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else {
            ctx.drawImage(this.cacheCanvas, this.x - this.r, this.y - this.r);
        }
    },

    cache : function () {
        this.cacheCtx.save();
        this.cacheCtx.fillStyle = this.color;
        this.cacheCtx.shadowColor = "white";
        this.cacheCtx.shadowBlur = this.r * 2;
        this.cacheCtx.beginPath();
        this.cacheCtx.arc(this.r * 3, this.r * 3, this.r, 0, 2 * Math.PI);
        this.cacheCtx.closePath();
        this.cacheCtx.fill();
        this.cacheCtx.restore();
    },

    move : function () {
        this.y -= config.move_distance;
        if (this.y <= -10) {
            this.y += 300;
        }
        this.draw();
    },

    die : function () {
        stars[this.id] = null;
        delete stars[this.id]
    }
};

export default Star