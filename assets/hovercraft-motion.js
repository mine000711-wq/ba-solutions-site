
(function (root) {
  const edges = [[0, 1], [1, 2], [2, 0]];
  const smooth = t => t * t * (3 - 2 * t);
  const clamp = t => Math.max(0, Math.min(1, t));
  function between(a, b) {
    const edge = edges.findIndex(p => p.includes(a) && p.includes(b));
    return { edge, from: edges[edge][0] === a ? 0 : 1, to: edges[edge][0] === b ? 0 : 1 };
  }
  class Motion {
    constructor() { this.edge = 0; this.u = 0; this.target = 0; this.queue = []; this.progress = 0; this.lastSegment = between(2, 0); }
    select(target) {
      this.target = target;
      this.queue = [];
      const pair = edges[this.edge];
      const at = this.u < 1e-7 ? pair[0] : (this.u > 1 - 1e-7 ? pair[1] : null);
      if (at !== null) {
        if (at !== target) this.queue.push(between(at, target));
      } else if (pair.includes(target)) {
        this.queue.push({ edge: this.edge, from: this.u, to: pair[0] === target ? 0 : 1 });
      } else {
        const end = this.u <= .5 ? 0 : 1;
        this.queue.push({ edge: this.edge, from: this.u, to: end });
        this.queue.push(between(pair[end], target));
      }
      if (this.queue.length) this.lastSegment = this.queue[0];
      this.progress = 0;
    }
    tick(dt, seconds) {
      let left = dt;
      while (this.queue.length && left > 0) {
        const segment = this.queue[0];
        this.lastSegment = segment;
        const duration = Math.max(.08, seconds * Math.abs(segment.to - segment.from));
        const use = Math.min(left, (1 - this.progress) * duration);
        this.progress = clamp(this.progress + use / duration); left -= use;
        this.edge = segment.edge;
        this.u = segment.from + (segment.to - segment.from) * smooth(this.progress);
        if (this.progress >= 1 - 1e-8) { this.u = segment.to; this.queue.shift(); this.progress = 0; }
      }
    }
    replay(target) {
      const segment = between((target + 2) % 3, target);
      this.edge = segment.edge; this.u = segment.from;
      this.select(target);
    }
    seek(fraction) {
      const segment = this.lastSegment;
      this.edge = segment.edge; this.u = segment.from + (segment.to - segment.from) * smooth(clamp(fraction));
      this.queue = []; this.progress = fraction;
    }
    get moving() { return this.queue.length > 0; }
    frame(count) { return Math.round(clamp(this.u) * (count - 1)); }
  }
  const api = { Motion, edges, smooth };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HoverMotion = api;
})(typeof window !== 'undefined' ? window : globalThis);
