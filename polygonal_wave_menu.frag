// Title: Polygonal Wave Menu
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time; // time in 
uniform vec2 u_mouse;
uniform vec2 u_resolution;
const float TWO_PI = 6.2832;
const float PI = 3.1416;

float rect(in vec2 start, in vec2 size, in vec2 pos) {
    vec2 end = start + size;
    return (
        step(start.x, pos.x) *
        step(-end.x, -pos.x) *
        step(start.y, pos.y) *
        step(-end.y, -pos.y)
    );
}

vec2 yrelative(in vec2 pos) {
  vec2 st = pos;
  st /= u_resolution.y;
  st.x -= (u_resolution.x-u_resolution.y)/u_resolution.y/2.0;
  st = st*2.0 -1.0;
  return st;
}

float circle(in vec2 center) {
    vec2 st = yrelative(gl_FragCoord.xy);
    return distance(st, center);
}

float nagon(in int N, in vec2 pos) {
  // Returns the radius an N-Polygon should have to include the current fragment
  if (N<3) return circle(pos);
  vec2 st = yrelative(gl_FragCoord.xy);
  st -= pos;
  float a = atan(st.x,st.y) + PI;
  float fan = TWO_PI/float(N);
  return length(st) * cos(floor(.5 + a/fan)*fan-a) / cos(fan/2.0);
}

float shape(in float radius, in float shapeness) {
    return smoothstep(1.0, 1.0-.01, shapeness/radius);
}

float ring(in float major, in float minor, in float shapeness) {
    return (
        shape(major, shapeness) - shape(minor, shapeness)
    );
}
float donut(in vec2 center, in float radius, in float minor) {
    vec2 st = yrelative(gl_FragCoord.xy);
    return smoothstep(radius+0.01, radius, distance(st, center))*
    smoothstep(-minor, -minor-0.01, -distance(st, center));
}
void main() {
    const int N = 9;
    const float R = 0.2;
    int sides[N];
    sides[0] = 6;
    sides[1] = 4;
    sides[2] = 3;
    sides[3] = 5;
    sides[4] = 8;
    sides[5] = 9;
    sides[6] = 7;
    sides[7] = 10;
    sides[8] = 0;
    vec3 colors[N];
    colors[0] = vec3(0.1, 0.0, 0.2);
    colors[1] = vec3(0.1, 0.1, 0.0);
    colors[2] = vec3(0.2, 0.0, 0.1);
    colors[3] = vec3(0.0, 0.2, 0.0);
    colors[4] = vec3(0.2, 0.1, 0.0);
    colors[5] = vec3(0.1, 0.1, 0.2);
    colors[6] = vec3(0.2, 0.1, 0.1);
    colors[7] = vec3(0.0, 0.1, 0.2);
    colors[8] = vec3(0.0, 0.1, 0.1);
    vec2 coords[N];
    coords[0] = vec2(+0.0, +0.4);
    coords[1] = vec2(+0.4, +0.0);
    coords[2] = vec2(+0.4, +0.4);
    coords[3] = vec2(-0.4, -0.4);
    coords[4] = vec2(+0.4, -0.4);
    coords[5] = vec2(-0.4, +0.4);
    coords[6] = vec2(-0.4, +0.0);
    coords[7] = vec2(+0.0, -0.4);
    coords[8] = vec2(+0.0, +0.0);

	vec3 color = (
        + vec3(0.)
        + vec3(.24, .2, .3) * .3*circle(vec2(.7, .8))
        //+ vec3(.1, .3, .5) * ring(.2, .1, circle(vec2(.8, -.6)))
        //+ vec3(.4, .1, .1) * rect(
        //    vec2(100.0, 600.0),
        //    vec2(200.0, 300.0),
        //    gl_FragCoord.xy
        //)
        //+ vec3(.3,.2,.5) * rect(
        //    vec2(350.0, 600.0),
        //    vec2(100.0, 300.0),
        //    gl_FragCoord.xy
        //)
    );
    for (int i=0; i<N; i++) {
        color += (
            + 3. * colors[i] * shape(R, nagon(sides[i], coords[i]))
            + 3.* colors[i] * shape(R, circle(coords[i]))
        );
        vec3 wave = colors[i] * fract(nagon(sides[i], coords[i])/R-u_time)/(1.0+circle(coords[i])*circle(coords[i]));
        if (distance(yrelative(u_mouse.xy), coords[i]) < R) {
            color += 1. * wave;
            color += vec3(.4, .8, .3) * ring(R*.8, R*.8-0.01, nagon(sides[i], vec2(0.,0.)));
        }
        else {
            color += 0.2 * wave;
        }
    }
    if (donut(vec2(yrelative(u_mouse.xy)), .04, .01)<.99)
        gl_FragColor = vec4(color, 0.5);
    else
        gl_FragColor = vec4(vec3(1.0) - color, 0.5);

}



