/* elements to include 

    // integration with prolific - added
    // information sheet - added
    // consent form - added
    // instructions - added
    // task stimuli
    // manipulation check (did they watch the videos?)
    // survey per stimuli
    // psychometric
    // IPC
    // demographic
    // 
    // redirect to prolific
    
*/


var jsPsychWebgazerValidate=function(t){"use strict";const e={name:"webgazer-validate",parameters:{validation_points:{type:t.ParameterType.INT,default:[[10,10],[10,50],[10,90],[50,10],[50,50],[50,90],[90,10],[90,50],[90,90]],array:!0},validation_point_coordinates:{type:t.ParameterType.SELECT,default:"percent",options:["percent","center-offset-pixels"]},roi_radius:{type:t.ParameterType.INT,default:200},randomize_validation_order:{type:t.ParameterType.BOOL,default:!1},time_to_saccade:{type:t.ParameterType.INT,default:1e3},validation_duration:{type:t.ParameterType.INT,default:2e3},point_size:{type:t.ParameterType.INT,default:20},show_validation_data:{type:t.ParameterType.BOOL,default:!1}}};class i{constructor(t){this.jsPsych=t}trial(t,e){var i={raw_gaze:[],percent_in_roi:[],average_offset:[],validation_points:null};t.innerHTML="\n        <div id='webgazer-validate-container' style='position: relative; width:100vw; height:100vh; overflow: hidden;'>\n        </div>";var a=t.querySelector("#webgazer-validate-container"),n=-1,o=null,r=performance.now();const s=()=>{this.jsPsych.extensions.webgazer.stopSampleInterval(),this.jsPsych.pluginAPI.clearAllTimeouts(),t.innerHTML="",this.jsPsych.finishTrial(i)},d=t=>{var n=u(t[0],t[1]);a.innerHTML=n;var o=a.querySelector(".validation-point").getBoundingClientRect(),s=o.left+o.width/2,d=o.top+o.height/2,l=performance.now()+e.time_to_saccade,c=l+e.validation_duration,h=[],v=this.jsPsych.extensions.webgazer.onGazeUpdate((t=>{performance.now()>l&&h.push({x:t.x,y:t.y,dx:t.x-s,dy:t.y-d,t:Math.round(t.t-r)})}));requestAnimationFrame((function t(){performance.now()<c?requestAnimationFrame(t):(i.raw_gaze.push(h),v(),p())}))},p=()=>{if(++n==o.length)c();else{var t=o[n];d(t)}},l=()=>{for(var t="",n=0;n<e.validation_points.length;n++){t+=u(e.validation_points[n][0],e.validation_points[n][1]),t+=h(e.validation_points[n][0],e.validation_points[n][1],0,0,e.roi_radius);for(var o=0;o<i.raw_gaze[n].length;o++)t+=v(e.validation_points[n][0],e.validation_points[n][1],i.raw_gaze[n][o].dx,i.raw_gaze[n][o].dy)}t+='<button id="cont" style="position:absolute; top: 50%; left:calc(50% - 50px); width: 100px;" class="jspsych-btn">Continue</btn>',a.innerHTML=t,a.querySelector("#cont").addEventListener("click",(()=>{this.jsPsych.extensions.webgazer.pause(),s()})),this.jsPsych.extensions.webgazer.showPredictions(),this.jsPsych.extensions.webgazer.stopSampleInterval(),this.jsPsych.extensions.webgazer.resume()},c=()=>{i.samples_per_sec=function(t){var e=[];if(0==t.length)return 0;for(var i=0;i<t.length;i++)if(t[i].length>1){for(var a=[],n=1;n<t[i].length;n++)a.push(t[i][n].t-t[i][n-1].t);e.push(a.reduce((function(t,e){return t+e}),0)/a.length)}return e.length>0?1e3/(e.reduce((function(t,e){return t+e}),0)/e.length):null}(i.raw_gaze).toFixed(2);for(var t=0;t<e.validation_points.length;t++)i.percent_in_roi[t]=(a=i.raw_gaze[t],n=void 0,o=void 0,void 0,n=a.map((function(t){return Math.sqrt(Math.pow(t.dx,2)+Math.pow(t.dy,2))})),o=n.reduce((function(t,i){return i<=e.roi_radius&&t++,t}),0),o/a.length*100),i.average_offset[t]=_(i.raw_gaze[t]);var a,n,o;e.show_validation_data?l():s()};function u(t,i){return"percent"==e.validation_point_coordinates?function(t,i){return`<div class="validation-point" style="width:${e.point_size}px; height:${e.point_size}px; border-radius:${e.point_size}px; border: 1px solid #000; background-color: #333; position: absolute; left:${t}%; top:${i}%;"></div>`}(t,i):"center-offset-pixels"==e.validation_point_coordinates?function(t,i){return`<div class="validation-point" style="width:${e.point_size}px; height:${e.point_size}px; border-radius:${e.point_size}px; border: 1px solid #000; background-color: #333; position: absolute; left:calc(50% - ${e.point_size/2}px + ${t}px); top:calc(50% - ${e.point_size/2}px + ${i}px);"></div>`}(t,i):void 0}function h(t,i,a,n,o){return"percent"==e.validation_point_coordinates?function(t,e,i,a,n){return`\n          <div class="validation-centroid" style="width:${2*n}px; height:${2*n}px; border: 2px dotted #ccc; border-radius: ${n}px; background-color: transparent; position: absolute; left:calc(${t}% + ${i-n}px); top:calc(${e}% + ${a-n}px);"></div>\n        `}(t,i,a,n,o):"center-offset-pixels"==e.validation_point_coordinates?function(t,e,i,a,n){return`\n          <div class="validation-centroid" style="width:${2*n}px; height:${2*n}px; border: 2px dotted #ccc; border-radius: ${n}px; background-color: transparent; position: absolute; left:calc(50% + ${t}px + ${i-n}px); top:calc(50% + ${e}px + ${a-n}px);"></div>\n        `}(t,i,a,n,o):void 0}function v(t,i,a,n){return"percent"==e.validation_point_coordinates?function(t,i,a,n){return`<div class="raw-data-point" style="width:5px; height:5px; border-radius:5px; background-color: ${Math.sqrt(a*a+n*n)<=e.roi_radius?"#afa":"#faa"}; opacity:0.8; position: absolute; left:calc(${t}% + ${a-2}px); top:calc(${i}% + ${n-2}px);"></div>`}(t,i,a,n):"center-offset-pixels"==e.validation_point_coordinates?function(t,i,a,n){return`<div class="raw-data-point" style="width:5px; height:5px; border-radius:5px; background-color: ${Math.sqrt(a*a+n*n)<=e.roi_radius?"#afa":"#faa"}; opacity:0.8; position: absolute; left:calc(50% + ${t}px + ${a-2}px); top:calc(50% + ${i}px + ${n-2}px);"></div>`}(t,i,a,n):void 0}function _(t){var e,i,a,n=t.reduce((function(e,i,a){return e+=i.dx,a==t.length-1?e/t.length:e}),0),o=t.reduce((function(e,i,a){return e+=i.dy,a==t.length-1?e/t.length:e}),0),r=(e=t.map((function(t){return Math.sqrt(Math.pow(t.dx-n,2)+Math.pow(t.dy-o,2))})),i=Math.floor(e.length/2),a=e.sort(((t,e)=>t-e)),e.length%2==0?a[i-1]+a[i]/2:a[i]);return{x:n,y:o,r:r}}(()=>{o=e.randomize_validation_order?this.jsPsych.randomization.shuffle(e.validation_points):e.validation_points,i.validation_points=o,n=-1,this.jsPsych.extensions.webgazer.startSampleInterval(),p()})()}}return i.info=e,i}(jsPsychModule);
// # sourceMappingURL=index.browser.min.js.map


/* SETTINGS */
var number_of_stimuli = 30; // total number of videos to be shown
var video_stimulus_duration = 30; // in seconds

/* START JSPSYCH timeline */

const jsPsych = initJsPsych({
    minimum_valid_rt: 100,
    // experiment_width: 800, 
    override_safe_mode: true,
    show_progress_bar: false,
    on_interaction_data_update: function(data) {
      console.log(JSON.stringify(data));
      jsPsych.data.write(data);
    },
    extensions: [
      {type: jsPsychExtensionWebgazer}
    ],
    on_finish: function () {
            // jsPsych.data.displayData();

            /* redirect to prolific for thank you etc
            disabled during the development */

            window.location = "https://app.prolific.co/submissions/complete?cc=3F4C0032"

        }
    });
    
    
// CSS INJECTION FUNCTION
// https://stackoverflow.com/a/50997732
//https://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript
function insertCss( code ) {
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        // IE
        style.styleSheet.cssText = code;
    } else {
        // Other browsers
        style.innerHTML = code;
    }
    document.getElementsByTagName("head")[0].appendChild( style );
}

document.head.innerHTML += '<link rel="stylesheet" href="https://unpkg.com/@jspsych/plugin-survey@0.1.1/css/survey.css">';
// document.head.innerHTML += '<link rel="stylesheet" href="https://unpkg.com/@jspsych/plugin-survey@0.1.1/css/survey.css">';


// INJECT THE CSS INTO FUNCTION
// Write the css as you normally would... but treat it as strings and concatenate for multilines
insertCss(
  `
  .jspsych-content-wrapper {
    margin-top:1em;
    padding-bottom:2em;
  }
  .jspsych-survey-multi-choice-question { 
      background-color: white;
      padding:5px;
      border-radius:5px;
      margin-top: 0em; 
      margin-bottom: 0em; 
      
  }
 .jspsych-survey-likert-preamble{
    background-color:white;
    border-radius:5px;
    padding:5px;

 }
  .jspsych-survey-multi-choice-text{
    margin-bottom:0em;
  }
 
  .top_bordered {	
    border-top: 1px solid black; 
  }
  
  .videosize {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%; 
    height: 100%;
    object-fit: cover;
}
  
body {
  background-color: lightgrey;
  font-family: sans-serif;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: top;
  align-items: center;
}

#text.fixed {
  padding-top: 0px;
  width: 80%;
  background-color: lightblue;
  left: auto;
  right: auto;
  margin: auto;
  overflow: auto;
}

#container.fixed {
  padding-top: 30px;
  width: 80%;
  height: auto;
  background-color: rgb(170, 15, 15);
  left: auto;
  right: auto;
  margin: auto;
  width: 100vw;
  height: 100vw;
}

.jspsych-survey-multi-choice-options {
  display:flex;
  width: 100%;
  justify-content: space-between;
}

.preamble800 {
  width: 100%;
  max-width: 800px;
  background-color: white;
  padding:5px;
  border-radius:5px;
}
  `
);



var feedback = {
  type: jsPsychHtmlButtonResponse,
  choices: ["Continue"],
  stimulus: function(){
  
    var interactions = jsPsych.data.interactionData.trials;
    var total_time_blurred = 0;
    var start =0;
    
    interactions.forEach(function(e){ 

      if(e.event === "blur") {
        start = e.time;
      }  
      
      if(e.event == "focus") {
        var time_blurred = e.time - start;
        total_time_blurred = time_blurred + total_time_blurred;
      }
     
    });
    
    total_time_blurred = 100 * total_time_blurred / jsPsych.getTotalTime();
    total_time_blurred = Math.round(total_time_blurred);

    if(total_time_blurred > 25) {
      var message = `<div style="border-radius: 25px; margin-bottom: 25px; background: #FFA500; color:white; padding: 20px;
  ">Oh oh, it seems you have spent `+total_time_blurred + `% of time away from the experiment. <p>Please consider to stay more focused, it matters a lot for the quality of the data.</p><p> We really appreciate your time :)`;
    } else {
      
      var total_time_focus =100-total_time_blurred;
      var message = `<div style="border-radius: 25px;  margin-bottom: 25px; border: 3px solid #73AD21;  padding: 20px;">      Well done, so far you have been `+total_time_focus+`% focused on the experiment. <p>Keep it up, we really appreciate it! :)`;
    }
    
    return message; 
    
  },
  data: {
    task: 'feedback'
  }
}


// CONDITION == 1 -> beauty question first
// CONDITION == 2 -> willingness to visit first  
  
// var images = ['/sam_arousal.png', '/sam_valence.png'];

// console.log(stimuli_database.length);
/*  subset stimuli */ 
stimuli_database = stimuli_database.filter((x) => x.testing_group === CONDITION);

/*  shuffle stimuli */ 
stimuli_database = jsPsych.randomization.repeat(stimuli_database, 1 );
console.log("n = "+stimuli_database.length + " Condition: "+ CONDITION);

// stimuli_database.forEach(function(v) {console.log(v.name_df)});
// console.log(stimuli_database);
/*  randomly sample N number of stimuli for the trials */
// stimuli_database = jsPsych.randomization.sampleWithoutReplacement(stimuli_database, number_of_stimuli );

// var green_condition = stimuli_database.filter(function(p){return p.environment == "Green";});
// var urban_condition = stimuli_database.filter(function(p){return p.environment == "Urban";});

// var urban_condition = jsPsych.randomization.sampleWithoutReplacement(urban_condition, 5 );
// var green_condition = jsPsych.randomization.sampleWithoutReplacement(green_condition, 5 );
// var stimuli_database = urban_condition.concat(green_condition);

// var green = [];
// var urban = [];


/*  sanity check, should return N number of trials */
// console.log(stimuli_database);

/* WEBGAZER */

var camera_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
  <p>In order to participate you must allow the experiment to use your camera.</p>
  <p>You will be prompted to do this on the next screen.</p>
  <p>If you do not wish to allow use of your camera, you cannot participate in this experiment.<p>
  <strong>It may take up to 30 seconds for the camera to initialize after you give permission.</strong>
  `,
  choices: ['Got it'],
  data: {
    task: 'camera_instructions'
  }
}

var init_camera = {
  type: jsPsychWebgazerInitCamera, 
  // on_load: function(){
  //   console.log('init');
        
  //   setTimeout(function () {
  //         var cont =  document.getElementById("webgazer-init-container");
  //   cont.style.width = "100%";
  //   }, 1);
    
  
  // }
}

var calibration_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
  <p>Now you'll calibrate the eye tracking, so that the software can use the image of your eyes to predict where you are looking.</p>
  <p>You'll see a series of dots appear on the screen. <p>Look at each dot and <span style="color: red;">click</span> on it.</p>
  `,
  choices: ['Got it'],
  data: {
    task: 'calibration_instructions'
  }
}

// var calibration_instructions_2 = {
//   type: jsPsychHtmlButtonResponse,
//   stimulus: `
//   <p>You'll see a series of dots appear on the screen. <p>Look at each dot and CLICK on it.</p>
//   `,
//   choices: ['Got it'],
//   data: {
//     task: 'calibration_instructions'
//   }
// }

var calibration = {
  type: jsPsychWebgazerCalibrate,
  calibration_points: [
  [25,25],[75,25],[50,50],[25,75],[75,75]
  ],
  calibration_mode: 'click',
  repetitions_per_point: 2,
  randomize_calibration_order: true,
  data: {
    task: 'calibration'
  }
}


var validation_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
  <p>Now we'll measure the accuracy of the calibration.</p>
  <p>Look at each dot as it appears on the screen.</p>
  <p style="font-weight: bold;">You do not need to click on the dots this time.</p>
  `,
  choices: ['Got it'],
  post_trial_gap: 1000,
  data: {
    task: 'validate_instructions'
  }
}

var validation = {
  type: jsPsychWebgazerValidate,
  validation_points: [
  [25,25],[75,25],[50,50],[25,75],[75,75]
  ],
  validation_point_coordinates: 'center-offset-pixels',
  roi_radius: 200,
  time_to_saccade: 1000,
  validation_duration: 2000,
  data: {
    task: 'validate'
  }
}

var recalibrate_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
  <p>The accuracy of the calibration is a little lower than we'd like.</p>
  <p>Let's try calibrating one more time.</p>
  <p>On the next screen, look at the dots and click on them.<p>
  `,
  choices: ['OK'],
}

var recalibrate = {
  timeline: [recalibrate_instructions, calibration, validation_instructions, validation],
  conditional_function: function(){
    var validation_data = jsPsych.data.get().filter({task: 'validate'}).values()[0];
    return validation_data.percent_in_roi.some(function(x){
      var minimum_percent_acceptable = 50;
      return x < minimum_percent_acceptable;
    });
  },
  data: {
    phase: 'recalibration'
  }
}

var calibration_done = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
  <p>Great, we're done with calibration!</p>
   <p>Press OK to start the study.</p>
  `,
  choices: ['OK']
}


var requestId;


/* capture info from Prolific */

var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');

jsPsych.data.addProperties({
  subject_id: subject_id,
  study_id: study_id,
  session_id: session_id
});

/* create timeline */
var timeline = [];

timeline.push({
  type: jsPsychFullscreen,
  fullscreen_mode: false
});

// var browserCheck = {
//   type: jsPsychBrowserCheck, 
//   features: ["width", "height", "webaudio", "browser", "browser_version", "mobile", "os", "fullscreen", "vsync_rate", "webcam", "microphone"]
// };


var browserCheck = {
  type: jsPsychBrowserCheck,
  inclusion_function: (data) => {
    console.log(data);
    return ['chrome', 'firefox'].includes(data.browser) && data.mobile === false
  },
  exclusion_message: (data) => {
    if(data.mobile){
      return '<p>You must use a desktop/laptop computer to participate in this experiment.</p>';
    } else if(!['chrome', 'firefox'].contains(data.browser) ){
      return '<p>You must use Chrome or Firefox as your browser to complete this experiment.</p>'
    }
  }
};



/* SOCIAL FORCE */ 

var simulation_duration = 30000; // mseconds
var fps = 20; // Frames per second
/* ------- PARAMETERS --------- */
// In comments mean values of Moussaid-Helbing 2009

// INTERNAL FORCE
const TAU = 0.54; //  0.54 controls the time to reach the desired velocity

// SOCIAL FORCE
const A = 40.5; // 4.5
const GAMMA = 1.35; //0.35
const N = 200.0; // 2 // controls how much they pivot around when approaching another agent
const N_PRIME = 30.0; // 3
const LAMBDA = 2.0; // 2.0

// Multipliers
const SFMUL = 1500;
const IFMUL = 0.1;

// Other
const collision_threshold = 5.0;
const VISION = 15.0;
const DT = 1; // Delta time for the simulation
/* ---------------------------- */


document.head.innerHTML += '<link rel="stylesheet" href="https://unpkg.com/@jspsych/plugin-survey@0.1.1/css/survey.css">';
// document.head.innerHTML += '<script type="module" src="https://unpkg.com/browse/flocc@0.5.20/dist/flocc.js"></script>';

// import flocc from 'flocc';
// const flocc = require('flocc');
// const FLOCK_SIZE = 320;

// Shall we set a common length instead of based on the participant screen?
const [width, height] = [600, 200]; // [window.innerWidth, window.innerHeight];

/* ------- SET UP ENVIRONMENT, RENDERER --------- */

const environment = new flocc.Environment({ width, height });
const renderer = new flocc.CanvasRenderer(environment, {
  width,
  height
});

let tree;
let container;
var requestId;
var fpsInterval = 1000 / fps;
var then = Date.now();

var timeline = [];

// export
var my_params = {
  player_id: null,
  collision_count: 0,
  collision_ids: [],
  up_timestamps: [],
  down_timestamps: [],
  start_time: 0,
  sf_duration: 0
};

// export 
var my_vectors = [null];

const text_disp = document.getElementById("text");
// text_disp.innerText = "running";

// function report(){
//     // const text_disp = document.getElementById("text");
//     monitor.innerText = "running";
// }


var new_collisions = [];
  
function collisions(agent) {
  var neighbors = tree.agentsWithinDistance(
    agent,
    collision_threshold
  );

  new_collisions = [];
  
  if (neighbors.length > 0) {
    neighbors.forEach(function (e) {
      if (my_params.collision_ids.indexOf(e.id) === -1) {
        my_params.collision_ids.push(e.id);
      } else {
        // console.log("collision with same");
      }
    });

    console.log(my_params.collision_ids);
    my_params.collision_count =  my_params.collision_ids.length;
    monitor.innerText = "collisions: " + my_params.collision_count;
  }
}

function internal_force(pos, destination, vel, max_speed) {
  const desired_direction = destination.clone().add(new flocc.Vector(-pos.x, -pos.y));

  const desired_velocity = desired_direction
    .clone()
    .normalize()
    .multiplyScalar(max_speed);
  const velocity_diff = desired_velocity
    .clone()
    .add(new flocc.Vector(-vel.x, -vel.y));
  const internalforce = velocity_diff.clone().multiplyScalar(1 / TAU);
  return internalforce;
}

function social_force(pos, vel, neighbors) {
  let force = new flocc.Vector(0, 0);

  neighbors.forEach((a) => {
    //neigh = j
    //self = i

    const neigh_pos = new flocc.Vector(a.get("x"), a.get("y"));
    const neigh_vel = new flocc.Vector(a.get("vx"), a.get("vy"));

    // x_j-x_i
    const pos_diff = neigh_pos.clone().add(new flocc.Vector(-pos.x, -pos.y));

    // e_ij
    const dir_diff = pos_diff.clone().normalize();
    // v_i-v_j
    const vel_diff = vel.clone().add(new flocc.Vector(-neigh_vel.x, -neigh_vel.y));

    // D_ij // mistake in the paper
    const interaction_v = vel_diff.clone().multiplyScalar(LAMBDA).add(dir_diff);
    // t_ij
    const interaction_d = interaction_v.clone().normalize();

    // n_ij (normal to the left of t_ij)
    const normal_interaction_d = interaction_d.clone().rotateZ(Math.PI / 2);

    // theta_ij
    const theta = Math.atan2(
      interaction_d.y - dir_diff.y,
      interaction_d.x - dir_diff.x
    );

    // B
    const B =
      GAMMA *
      Math.sqrt(
        interaction_v.x * interaction_v.x + interaction_v.y * interaction_v.y
      );

    // K
    let K = 0;
    if (theta > 0.0001) {
      K = 1;
    } else if (theta < 0.0001) {
      K = -1;
    }
    const d = Math.sqrt(pos_diff.x * pos_diff.x + pos_diff.y * pos_diff.y);

    // magnitude Force velocity
    const f_v_mag =
      -1 *
      A *
      Math.exp((-1 * d) / B - N_PRIME * B * theta * (N_PRIME * B * theta));
    const f_t_mag =
      -1 * A * K * Math.exp((-1 * d) / B - N * B * theta * (N * B * theta));

    const force_ij = interaction_d
      .clone()
      .multiplyScalar(f_v_mag)
      .add(normal_interaction_d.clone().multiplyScalar(f_t_mag));

    force = force.add(force_ij);
  });

  return force;
}
// export
 function tickAgent(agent) {
  const { x, y, vx, vy, max_speed, final_direction } = agent.getData();

  const pos = new flocc.Vector(x, y);
  var vel = new flocc.Vector(vx, vy);
  // TODO
  // const destination = pos.clone().add(new flocc.Vector(200, 0));
  const destination =
    final_direction === "left"
      ? pos.clone().add(new flocc.Vector(-200, 0))
      : pos.clone().add(new flocc.Vector(200, 0));

  const neighbors = tree.agentsWithinDistance(agent, VISION);

  const my_force = internal_force(pos, destination, vel, max_speed);
  const s_force = social_force(pos, vel, neighbors);

  var acc;

  if (agent.id === my_params.player_id) {
    // Ignoring social force for player
    acc = my_force.clone();
    collisions(agent);
    //console.log(s_force.x, s_force.y);

    //my_vectors[0] = { start: pos, end: pos };
  } else {
    acc = my_force
      .clone()
      .multiplyScalar(IFMUL)
      .add(s_force.clone().multiplyScalar(SFMUL));
    // Uncomment for static crowd
    // vel = new flocc.Vector(0, 0);
    // acc = new flocc.Vector(0, 0);
  }

  vel.add(acc.clone().multiplyScalar(DT));
  if (vel.length() > max_speed) vel.normalize().multiplyScalar(max_speed);
  pos.add(vel);
  
  // Finish trial when player reaches middle of the screen
  // This or time based in main
  if ((agent.id === my_params.player_id) & (pos.x > width*0.99)){
    stop();

    jsPsych.finishTrial(
      {
        collision_count: my_params.collision_count,
        up_timestamps: my_params.up_timestamps.toString(),
        down_timestamps: my_params.down_timestamps.toString(),
        sf_duration: my_params.sf_duration,
        collisions_ids: my_params.collision_ids.toString()
      
    });
  } 

  return {
    x: pos.x,
    y: pos.y,
    vx: vel.x,
    vy: vel.y
  };
}


function social_force_main(FLOCK_SIZE, TASK_DURATION){
  // Stop any previous animation request
  environment.clear();
  stop();
  
  // This needs to be put somewhere else
  document.addEventListener("keydown", logKey);
  console.log(FLOCK_SIZE +" "+ TASK_DURATION);
  console.log(my_params.up_timestamps);
  
  my_params.start_time = environment.time;

  my_params.up_timestamps.length = 0;
  my_params.down_timestamps.length = 0;

  my_params.up_timestamps.push(environment.time - my_params.start_time); 
  my_params.down_timestamps.push(environment.time - my_params.start_time); 

  
  var monitor = document.createElement("p");
  var text = document.createTextNode("collisions: 0");
  monitor.setAttribute('id', 'monitor');
  monitor.appendChild(text);
  
  container = document.getElementById("jspsych-content");
  renderer.mount(container);
  
  container.appendChild(monitor);
  environment.clear();
  my_params.collision_count = 0;
  setup(FLOCK_SIZE);
  const p = environment.getAgentById(my_params.player_id);
  console.log(p.getData().vx);
  
  var startTime = Date.now();
  /*
  // stop TASK_DURATION mseconds later
  jsPsych.pluginAPI.setTimeout(function(){
      console.log(Date.now() - startTime);
      console.log("#FINISHED RUN !",my_params.collision_count)
      stop(container);
      // Shall we call the end of the trial when the player reaches
      // the end of the screen?
      jsPsych.finishTrial({collision_count: my_params.collision_count});
  }, TASK_DURATION);
  */
  // console.log("#RUN!")
  run();
}

  

function setup(FLOCK_SIZE) {
  /* Add crowd agents */


  for (let i = 0; i < FLOCK_SIZE; i++) {
    const agent = new flocc.Agent();

    agent.set("x", flocc.utils.random(0, environment.width));
    agent.set("y", flocc.utils.random(0, environment.height));

    //const angle = 2 * Math.random() * Math.PI;
    // Math.round(Math.random()) * 180
    const angle = 0;

    //agent.set("shape", "arrow");
    //agent.set("size", 2.5);
    const direction = flocc.utils.uniform() < 0.5 ? "left" : "right";
    agent.set("shape", "circle");
    agent.set("color", direction === "left" ? "black" : "black");
    agent.set("size", 5);

    agent.set("vx", Math.cos(angle));
    agent.set("vy", Math.sin(angle));

    // Max speed
    agent.set("max_speed", flocc.utils.random(1.2, 3.0));

    // Direction
    agent.set("final_direction", direction);

    //agent.addRule(tick);
    agent.set({ tick: tickAgent });

    environment.addAgent(agent);
  }

  /* Add player */
  const player = new flocc.Agent();
  my_params.player_id = player.id;

  player.set("x", 5);
  player.set("y", environment.height / 2);

  const angle = 0;

  player.set("shape", "circle");
  player.set("color", "red");
  player.set("size", 5);

  player.set("vx", Math.cos(angle));
  player.set("vy", Math.sin(angle));
  player.set("max_speed", 3.2);
  player.set("final_direction", "right");

  player.set({ tick: tickAgent });

  environment.addAgent(player);

  tree = new flocc.KDTree(environment.getAgents(), 2);
  environment.use(tree);
}

var sf_running = false;

  function run() {
    
    //if (count >= max_counter) return;
    requestId = requestAnimationFrame(run);
    var now = Date.now();

    var elapsed = now - then;
    
    if (elapsed < fpsInterval) return;
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);
    
    sf_running = true;
    
    // draw frame here
    //count=count+1;
    environment.tick({ randomizeOrder: true });
    
  }

  function stop() {
    
    // console.log("stop sf");
    my_params.sf_duration = environment.time - my_params.start_time;
    sf_running = false;
    my_params.player_id = null;
    if (requestId) {
      window.cancelAnimationFrame(requestId);
      requestId = undefined;
    }
    renderer.mount(container);
  }

function logKey(e) {
  
  if ( sf_running ) {
    
    const p = environment.getAgentById(my_params.player_id);
    if (e.code === "ArrowUp") {
      my_params.up_timestamps.push(environment.time - my_params.start_time); 
      p.set("y", p.getData().y - 5);
      // console.log(environment.time);
    }
  
    if (e.code === "ArrowDown") {
      my_params.down_timestamps.push(environment.time - my_params.start_time);
      // const p = environment.getAgentById(my_params.player_id);
      p.set("y", p.getData().y + 5);
      //console.log(environment.time);
    }
    
    
  }

  
}


var socialForce_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `For this last task: 
  
<p> You will play a simple game with 8 levels (it takes only a few seconds per level). </p>
  
<p>  You will see a red dot moving from left to right. </p>
<p>  You can only move the <span style="color:red"> red dot </span> up or down, using the <span style="color:red"> Arrow UP </span> or <span style="color:red"> Arrow DOWN </span> keys.</p>

<p> <strong> Your objective is to avoid collisions with any black dots that will be moving on the screen. </p>
  </strong> 
  
<p>  Click the button when you are ready to begin the task.</p>`,
  choices: ["Start"]
};

var start_sf_button = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 'Click the button when you are ready to begin the task',
  choices: ["Start"]
};

var sf_task = {
    type: jsPsychCallFunction,
    async: true,
    func: function(done){
        // generate a delay between 1500 and 3000 milliseconds to simulate  
        // waiting for an event to finish after an unknown duration,
        // then move on with the experiment
        social_force_main(jsPsych.timelineVariable('crowd_count'), simulation_duration);
    }, 
    data: {
      task: 'sf_task',
      crowd_count : jsPsych.timelineVariable('crowd_count'), 
    }
};


var sf_reaction_1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 'Did you find this level of the game <strong>stressful</strong>? <p>',
  choices: [1, 2, 3, 4, 5, 6, 7],
  response_ends_trial: true,
  trial_duration: null,
  require_movement: true,
  on_load: function(){
    const list = document.getElementById("jspsych-html-button-response-btngroup");
    list.insertBefore(document.createTextNode("Not at all"), list.children[0]);
    list.appendChild(document.createTextNode("Very much"));
  },
  data: { task: 'sf_reaction_stressful'}
}

var sf_reaction_2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 'Did you find this level of the game <strong>enjoyable</strong>? <p>',
  choices: [1, 2, 3, 4, 5, 6, 7],
  response_ends_trial: true,
  trial_duration: null,
  require_movement: true,
  on_load: function(){
    const list = document.getElementById("jspsych-html-button-response-btngroup");
    list.insertBefore(document.createTextNode("Not at all"), list.children[0]);
    list.appendChild(document.createTextNode("Very much"));
  },
  data: { task: 'sf_reaction_enjoyable'}
}









/* define welcome message trial */

var welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Welcome to the experiment. Press any key to begin."
};


/* define instructions trial */
var instructions = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Next'],
  stimulus: 
  `<div style="text-align:center; max-width:800px; width: 100%;">
 
  <b> Instructions </b>
  <div style="text-align:left; width: 100%;"> In this experiment, you will watch a few of videos that show walking in a place (like a street), 
  from a first-person perspective, in other words, as if you were walking there yourself. 
  </br>
  <p>
 
  Each video lasts around 30 seconds, and at the end of each video, there are few questions.  There are no right or wrong answers, so following your intuition is usually the best.  
   </p>
  <br>
  We will first do a test run so that you get familiar with the setup. The demo video shows a fish-tank!
  </p></div>
  `, // Imagine you are walking there as part of <b>your daily commute.</b>
  post_trial_gap: 100
};

    
/* define fixation cross (pre-trials) */
var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: function () {
    return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
  },
  data: {
    task: 'fixation',
    video: jsPsych.timelineVariable('link'),

  }
};

/* define test trial (stimulus presentation */  
var demo_video = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    
    // TODO add call to timer function here
    
    // var stim = '<p style="font-size:30px;font-weight:bold;">'+jsPsych.timelineVariable('text')+'</p>';
    var stim = 
    `
    <div> This is a demo.
    <div id="loading" >Video is loading </div>
    </div>
    <video id="jspsych-video" disablepictureinpicture=true muted loop=false crossorigin:anonymous autoplay width = "600">
    <source type="video/mp4" src = "src/fish.mp4">    </video>
    `;

    return stim;
  },
  
  on_load: function() {
    // wait for 3 seconds, 
    let video = document.getElementById('jspsych-video');
    video.onloadeddata = function() {
    // video is loaded
          document.getElementById("loading").innerHTML = "";
    }
  },
  choices: [],
  trial_duration: 5000,
  response_ends_trial: false,
  data: { task: 'demo' },
  extensions: [
    {
      type: jsPsychExtensionWebgazer, 
      params: { 
        targets: ['#jspsych-video']
      }
    }
  ]

}


var post_demo = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Start'],
  stimulus: 
  `
  <div class="">
  <strong> Instructions </strong>
  <p style="text-align:center ; width: 100%;"> 
  Now we will start the first block of the experiment.
  <br> 
  It takes approximately 15 minutes to complete.
  <br> 
  
  <span style="color:red">Remember, the videos have no sound.</span>

  <br>
  Press the 'Start' button when you are ready.
  </p>
  </div>
  `,
  post_trial_gap: 100,
  data: { task: 'post_demo_instructions' }
};

/* psychometric scales */

    
var ipip6_questions = [];
ipip6.forEach( function (item,i) {
  ipip6_questions.push({prompt: item, name: i, required: true, labels: [ "-3 <p>strongly disagree",-2,-1, "0 <p> undecided" , 1,2, "3 <p>strongly agree" ]});
});

var ipip6 = {
  type: jsPsychSurveyLikert,
  preamble:`<div class="preamble800">Please rate your degree of agreement/disagreement with each of the statements below. </div>`,
  questions: ipip6_questions,       
  // scale_width:800,
  randomize_question_order: false,
  data: { task: 'ipip6' }

};

var sias6_sf_questions = [];
  sias6_sf.forEach( function (item, i) {
    sias6_sf_questions.push({prompt: item, name: item, required: true, labels: [ "-3 <p>strongly disagree",-2,-1, "0 <p> undecided" , 1,2, "3 <p>strongly agree" ]});
});
    
var sias6_sf = {
  type: jsPsychSurveyLikert,
  preamble:`<div class="preamble800">Please rate your degree of agreement/disagreement with each of the statements below.</div> `,
  questions: sias6_sf_questions,  
  // scale_width:800,
  randomize_question_order: false,
  data: { task: 'sias6_sf' }

};

var sps_sf_prompts = [];
sps_sf.forEach( function (item, i) {
    sps_sf_prompts.push({prompt: item, name: item, required: true, labels: [ "-3 <p>strongly disagree",-2,-1, "0 <p> undecided" , 1,2, "3 <p>strongly agree" ]});
});

var sps_sf = {
  type: jsPsychSurveyLikert,
  questions: sps_sf_prompts,      
  // scale_width:800,
  randomize_question_order: false,
  data: { task: 'sps_sf' }
}

var nss_sf = {
  type: jsPsychSurveyLikert,
  preamble:`<div class="preamble800">Please rate your degree of agreement/disagreement with each of the statements below.</div> `,
  questions: nss_sf_scale,        
  randomize_question_order: false,
  // scale_width:800,
  data: { task: 'nss_sf' }
};


// stimulus screening ability
var ssa_sf_questions = [];
  ssa_sf.forEach( function (item,i) {
    ssa_sf_questions.push({prompt: item, name: item, required: true, labels: [ "-3 <p>strongly disagree",-2,-1, "0 <p> undecided" , 1,2, "3 <p>strongly agree" ] });
});

var ssa_sf = {
  type: jsPsychSurveyLikert,
  // scale_width:800,
  preamble: `<div class="preamble800">Please rate your degree of agreement/disagreement with each of the statements below. <p>You may agree or disagree in different ways with each statement, using the following scale. There are no right or wrong answers. Following your intuition is usually the best.</div>`, // // The highest rating is “very strongly agree” (+3). If you cannot agree or disagree, answer “undecided” (0). 
  questions: ssa_sf_questions,        
  randomize_question_order: false,
  // choices: [],
  data: { task: 'stimulus_screening_ability' }

};


//   var concern_for_covid = {
//   type: jsPsychSurveyLikert,
//   preamble: "The following questions are about your experience with COVID-19.",
//   questions: [
//     {prompt: "Contracting COVID-19 is something that worries me when I am in a crowd.", name: 1 , labels: likert_scale},
//     {prompt: "When I am in public spaces, I pay a lot of attention if people are wearing their masks.", name: 2, labels: likert_scale},
//     {prompt: "Because of COVID, I avoid going to busy locations like downtown, shop, or malls.", name: 3, labels: likert_scale},
//     {prompt: "I think when you are outdoors there is not a lot of risk to contract COVID.", name: 4, labels: likert_scale}
//   ],
//   randomize_question_order: true,
//   data: {task: "concern_for_covid"}

// };

 
var semantic_differential_items = [
  {left: "boring", right: "interesting", name: "boring-interesting"},
  {left: "unattractive", right: "scenic", name: "dull-scenic"}, 
  {left: "ugly", right: "beautiful", name: "ugly-beauty"}, 
  {left: "unfamiliar", right: "familiar", name: "unfamiliarfamiliar"}, 
  {left: "narrow", right: "wide", name: "narrow-wide"}, 
  {left: "chaotic", right: "ordered", name: "chaotic-ordered"}, 
  {left: "empty", right: "crowded", name: "empty-crowded"}
]; 

survey_formatted = [];

semantic_differential_items = jsPsych.randomization.repeat(semantic_differential_items, 1 );
semantic_differential_items.forEach(function(p) { 
  survey_formatted.push(
  {
      prompt: '<div class = "likert_promt"> <span class="text_left", style="float:left">'+p.left+'</span> <span class="text_right", style="float:right">'+p.right+'</span> </div>', 
      name: p.name, 
      options: [1,2,3,4,5,6,7], 
      required: false,
      horizontal: true,
      css_classes: ['top_bordered']
    });
});

var semantic_differential = {
  preamble: `<div> Please rate the environment shown in this video: </div>`,
  type: jsPsychSurveyMultiChoice,
  questions: survey_formatted, 
  randomize_question_order: true,
  on_load: function(){
     var box = document.getElementsByClassName("jspsych-survey-multi-choice-question");
    Array.from(box).forEach(function(e) { 
      
       var d = document.createElement( 'div');  	
      d.classList.add("jspsych-survey-multi-choice-options");
      
      var notes = [];
    	for (var i = 0; i < e.childNodes.length; i++) {
        
        if (e.childNodes[i].className == "jspsych-survey-multi-choice-option") {
          notes.push(e.childNodes[i]);
        }     
      }
        // console.log(notes.length)
     	for (var i = 0; i < notes.length; i++) {
        d.appendChild(notes[i]);
      }
       console.log(d); 
       e.appendChild(d);
    });
    
    },
  data: { 
    task: 'aesthetic_visit', 
    video: jsPsych.timelineVariable('link') }
}

/* SAM */

var emotion_items = [
  {left: "negative", right: "positive", name: "positive-negative"},
  {left: "calm", right: "excited", name: "calm-excited"}
];

var emotions = [];  
emotion_items.forEach(function(p) { 
emotions.push(
  {
      prompt: '<span style="float:left">'+p.left+'</span> <span style="float:right">'+p.right+'</span>', 
      name: p.name, 
      options: [1,2,3,4,5,6,7,8,9], 
      required: true,
      horizontal: true,
      css_classes: ['top_bordered']
    });
});

var emotions_scale = {
  type: jsPsychSurveyMultiChoice,
  preamble: "How did you feel while watching this video?<p>",
  questions: emotions, 
  randomize_order:true,
  data: { task: 'emotions', 
    video: jsPsych.timelineVariable('link') }
}

var trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    // console.log(jsPsych.timelineVariable('link').toString());
    var stim = // style="max-width:60%"";
    `
    <div >
    <div id ="loading">Video is loading</div>
    <video id="jspsych-video" class="videosize" disablepictureinpicture muted crossorigin:anonymous autoplay>
    <source type="video/mp4" src = `+
    jsPsych.timelineVariable('link')+
    `>
    </video>
    </div>
    `;
    return stim;
  },
  choices: [],
  data: {
    task: 'stimulus', 
    video: jsPsych.timelineVariable('link'),
  },
  // stimulus_duration: 5000,
  // trial_duration: 2000,
  on_load: function() {
    var video = document.getElementById('jspsych-video');
    video.onloadeddata = function() {
      // video is loaded
      document.getElementById("loading").innerHTML = "";
      // console.log(video.duration); 

    }
    var playing = true;
    video.addEventListener("timeupdate", function(){
      if(playing & this.currentTime >= video_stimulus_duration || this.currentTime >= video.duration ) { // time in seconds
          this.pause();
          playing = false;
          // console.log("video completed");
          jsPsych.finishTrial({video_completed: true});
      }
    });
  },
   extensions: [
    {
      type: jsPsychExtensionWebgazer, 
      params: {targets: ['#jspsych-video']}
    }
  ]
} 

var buffer = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 'Video ended',
  choices: [],
  trial_duration: 2000,
  data: { task: 'buffer' }
};

var willingnesstowalk = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 'Would you like to walk on this place?<p>',
  choices: [1, 2, 3, 4, 5, 6, 7],
  response_ends_trial: true,
  trial_duration: null,
  require_movement: true,
  on_load: function(){
    const list = document.getElementById("jspsych-html-button-response-btngroup");
    list.insertBefore(document.createTextNode("Not at all"), list.children[0]);
    list.appendChild(document.createTextNode("Very much"));
  },
  data: {    
    task: 'willingnesstowalk', 
    video: jsPsych.timelineVariable('link') 
  }
}

  
var presence = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 'I had a sense of being there in that place<p>',
  choices: [1, 2, 3, 4, 5, 6, 7],
  response_ends_trial: true,
  require_movement: true,
  on_load: function(){
    const list = document.getElementById("jspsych-html-button-response-btngroup");
    list.insertBefore(document.createTextNode("Not at all"), list.children[0]);
    list.appendChild(document.createTextNode("Very much"));
  },
  data: {
    task: 'presence', 
    video: jsPsych.timelineVariable('link')
  }
}


var being_away = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 'Spending time there would give me a good break from my day-to-day routine<p>',
  choices: [1, 2, 3, 4, 5, 6,7],
  response_ends_trial: true,
  require_movement: true,
  on_load: function(){
    const list = document.getElementById("jspsych-html-button-response-btngroup");
    list.insertBefore(document.createTextNode("Not at all"), list.children[0]);
    list.appendChild(document.createTextNode("Very much"));
  },
  data: {
    task: 'being_away', 
    video: jsPsych.timelineVariable('link')
  }
}



var enter_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true
}

var trial_in_fullscreen = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 'This trial will be in fullscreen mode.',
  choices: ['Continue']
}

   
/* define test procedure */

var trial_block_1 = {
  timeline: [fixation, trial, buffer,  willingnesstowalk, emotions_scale, presence, being_away, semantic_differential], // , sam_procedure, presence
  timeline_variables: stimuli_database.slice(0,15), // 15
  randomize_order: true,
  repetitions: 1 // how many times to repeat each stimulus
}

var little_break_1 = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Continue'],
  stimulus: 
  `
  <p style="text-align:center ; width: 100%;"> 
  You have now watched 50% of the videos.
  </p>
  `,
  post_trial_gap: 100, 
  data: { task: 'little_break' }
};

var little_break_2 = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Continue'],
  stimulus: 
  `
  <b> Let's take a short break </b>
  <p style="text-align:center ; width: 100%;"> 
  <br> 
  This is a good time to take short break if you need to.
  <br>
  Press the 'Continue' button when you are ready to continue with the experiment.
  </p>
  `,
  post_trial_gap: 100, 
  data: { task: 'little_break' }
};



var trial_block_2 = {
  timeline: [fixation, trial, buffer,  willingnesstowalk, emotions_scale, presence, being_away, semantic_differential], // , sam_procedure, presence
  timeline_variables: stimuli_database.slice(15, 30),
  randomize_order: true,
  repetitions: 1 // how many times to repeat each stimulus
}



var demo_trial = {
  timeline: [fixation, demo_video, buffer,  willingnesstowalk, emotions_scale, presence, being_away, semantic_differential], // , sam_procedure, presence
  randomize_order: true,
  repetitions: 1 // how many times to repeat each stimulus
}

var post_trial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Start'],
  stimulus: 
  `<div style="text-align:center; max-width:800px; width: 100%;">
  <strong> Instructions </strong>
  <p> 
  You have now completed the first stage of this experiment.
  <br> 
  Now, we will ask you to fill-in a few questionnaires. This stage takes about 20 minutes.
  <br>
  Press the 'Start' button when you are ready.
  </p> </div>
  `,
  post_trial_gap: 100, 
  data: { task: 'instructions_post_stimuli' }
};


var likert_scale = [
  "Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"
];

var concern_for_covid = {
  type: jsPsychSurveyLikert,
  preamble: `<div class="preamble800"> The following questions are about your experience with COVID-19.</div>`,
  questions: [
    {prompt: "Contracting COVID-19 is something that worries me when I am in a crowd.", name: 1 , labels: likert_scale},
    {prompt: "When I am in public spaces, I pay a lot of attention if people are wearing their masks.", name: 2, labels: likert_scale},
    {prompt: "Because of COVID, I avoid going to busy locations like downtown, shop, or malls.", name: 3, labels: likert_scale},
    {prompt: "I think when you are outdoors there is not a lot of risk to contract COVID.", name: 4, labels: likert_scale}
  ],
  randomize_question_order: true,
  data: {task: "concern_for_covid"}

};

var preference_for_crowds = {
  type: jsPsychSurveyLikert,
  preamble: `<div class="preamble800"> The following questions are about your general preferences in terms of outdoor environments.</div>`,
  questions: [
    {prompt: "I like being in crowded places.", name: 1, labels: likert_scale},
    {prompt: "During my leisure time, enjoy walking downtown among pedestrian crowds.", name: 2, labels: likert_scale},
    {prompt: "During my commute, I like being in a crowded public transport", name: 3, labels: likert_scale},

  ],
  randomize_question_order: true,
  data: {task: "preference_for_crowds"}

};

//<br><small>if yes, please add info: Masters Architecture</small>
/* demographics */ 
var demographics = {
  type: jsPsychSurveyText,
  preamble: `<div class="preamble800"> The following questions are about your background.</div>`,
  require:true,
  questions: [
    {prompt: "How old are you? <br><small>(00 years old)</small>", placeholder: "e.g. 25", name: 'Age', required: true}, 
    {prompt: "Do you have a background in Architecture or Urban Design?<br><small>if yes, please mention your degree, e.g. Master in Architecture</small>", placeholder: "yes/no + details", name: 'ArchitectureBackground', required: true}, 
    {prompt: "Do you have a background in Arts? <br><small>if yes, please mention your degree, e.g. Master in Art History</small>", placeholder: "yes/no + details", name: 'Arts_bacground', required: true}, 
    {prompt: "Did you grow up in a rural or urban environment?", placeholder: "Urban / suburban / small town / Rural", name: 'Urban_Rural', required: true}, 
    {prompt: "Which country did you grow up?", placeholder:"name of country", name: 'Grow-up country', required: true}, 
    {prompt: "Where did you grow up?", placeholder:"name of place (city, town, etc) & name of country", name: 'Grow-up City', required: true}, 
    {prompt: "Where do you live now? ", placeholder:"name of place (city, town, etc) & name of country", name: 'Lives_now', required: true}, 
    {prompt: "How long have you lived in your current place of residence? ", placeholder:"number of years", name: 'years_Lives_now', required: true}, 
  ], 
  data: {task: "demographics"}
};


/* define test procedure */
var trial_social_force = {

  timeline: [start_sf_button, sf_task, sf_reaction_1, sf_reaction_2 ],
  timeline_variables: [
    {crowd_count: 50},
    {crowd_count: 69},
    {crowd_count: 97},
    {crowd_count: 134},
    {crowd_count: 186},
    {crowd_count: 259},
    {crowd_count: 360},
    {crowd_count: 500}
    
    ],
  randomize_order: true,
  repetitions: 1 // how many times to repeat each stimulus
}

var end_social_force = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Next'],
  stimulus: 
  `
  Done, this is task is finished too.  `,
  post_trial_gap: 100, 
  data: { task: 'end_social_force' }
};

var end_feedback = {
  type: jsPsychSurveyText,
  preamble: `<strong>Feedback to the researchers</strong>`,
  questions: [
    {prompt: `Do you have any feedback for us? <br><small>
    (for example, Did the experiment work correctly? Did you face any issues?)`, rows: 5}
  ],
  data: { task: 'end_feedback' }

}

var end_experiment = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Next'],
  stimulus: 
  `
  <strong> The end! </strong>
  <p style="text-align:center ; width: 100%;"> 
  Thank you! You have now completed all procedures of this experiment.
  <br> 
  When you click next, you will be redirect to Prolific.co to be reimbursed.
  <br>
  Press the 'Next' button when you are ready.
  </p>
  `,
  post_trial_gap: 100, 
  data: { task: 'end_experiment' }
};


timeline.push(welcome);

// /* eye-tracking calibration*/
timeline.push(camera_instructions, init_camera, calibration_instructions, calibration);  //calibration_instructions_2

// /* eye-tracking validation*/
timeline.push(validation_instructions, validation, recalibrate, calibration_done);

// /* demo */
timeline.push(instructions, demo_trial, feedback, post_demo);

// /* main block */
timeline.push(enter_fullscreen, trial_in_fullscreen);  
timeline.push(trial_block_1);
timeline.push(little_break_1, feedback, little_break_2);
timeline.push(trial_block_2);
timeline.push(post_trial);

/* all scales */ 
timeline.push(preference_for_crowds); 
timeline.push(concern_for_covid); 
timeline.push(ssa_sf); // stimulus screening ability 
timeline.push(nss_sf); // noise 
timeline.push(sias6_sf);  // social anxie/ty
timeline.push(sps_sf); // social ph/obia
timeline.push(ipip6); // personality

timeline.push(demographics);
timeline.push(socialForce_instructions,trial_social_force, end_social_force);
timeline.push(end_feedback);

timeline.push(end_experiment); 

// /* start the experiment */
jsPsych.run(timeline);
