new Vue({
    el: '#vueApp2',
    data: {
        pointsInput: '',
        points: [],
        edges: []
    },
    methods: {
        createGraph() {
            this.points = this.pointsInput.split(' ').map(point => {
                const [x, y] = point.split(',').map(Number);
                return { x, y };
            });
            this.drawGraph();
        },
        drawGraph() {
            const svg = d3.select('#graph').append('svg')
                .attr('width', 420)
                .attr('height', 400);

            svg.selectAll('.node')
                .data(this.points)
                .enter().append('circle')
                .attr('class', 'node')
                .attr('r', 5)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            this.edges.forEach(edge => {
                svg.append('line')
                    .attr('class', 'link')
                    .attr('x1', this.points[edge.source].x)
                    .attr('y1', this.points[edge.source].y)
                    .attr('x2', this.points[edge.target].x)
                    .attr('y2', this.points[edge.target].y);
            });
        },
        startAlgorithm() {
            this.edges = this.calculateTSP();
            d3.select('#graph svg').remove();
            this.drawGraph();
        },
        calculateTSP() {
            let edges = [];
            let visited = Array(this.points.length).fill(false);
            let current = 0;
            visited[current] = true;

            for (let i = 1; i < this.points.length; i++) {
                let nearest = -1;
                let minDistance = Infinity;

                for (let j = 0; j < this.points.length; j++) {
                    if (!visited[j]) {
                        let distance = Math.hypot(this.points[current].x - this.points[j].x, this.points[current].y - this.points[j].y);
                        if (distance < minDistance) {
                            minDistance = distance;
                            nearest = j;
                        }
                    }
                }
                edges.push({ source: current, target: nearest });
                visited[nearest] = true;
                current = nearest;
            }
            return edges;
        }
    }
});
