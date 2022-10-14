/*! 
 * The Center Game v.1.1
 * https://github.com/kefiijrw/The-Center-Game
 *
 * Author: Sergey Nikolaev
 * kefiijrw.com
 *
 * Date: 2022-10-14
 */

var min_angle = 5;
var max_angle = 40;

var min_radius = 50;

var center_x;
var center_y;
var radius;

var mouse_x;
var mouse_y;

/*
mode 1 – average: get the maximum average score out of round_count attempts
mode 2 – maraphon: hit as many times in a row as possible better than the score_limit
*/
var mode = 2; 
var round_count = 5;
var score_limit = 40;

dpr = window.devicePixelRatio || 1;

var canvas_t = document.getElementById('canvas_top');
var canvas_b = document.getElementById('canvas_bottom');
var canvas_c = document.getElementById('canvas_circle');


var c_b = canvas_b.getContext('2d');
var c_t = canvas_t.getContext('2d');
var c_c = canvas_c.getContext('2d');

c_b.canvas.width = window.innerWidth*dpr;
c_b.canvas.height = window.innerHeight*dpr;
c_t.canvas.width = window.innerWidth*dpr;
c_t.canvas.height = window.innerHeight*dpr;
c_c.canvas.width = window.innerWidth*dpr;
c_c.canvas.height = window.innerHeight*dpr;

c_b.scale(dpr, dpr);
c_t.scale(dpr, dpr);
c_c.scale(dpr, dpr);

c_b.canvas.style.width = window.innerWidth + 'px';
c_b.canvas.style.height = window.innerHeight + 'px';
c_t.canvas.style.width = window.innerWidth + 'px';
c_t.canvas.style.height = window.innerHeight + 'px';
c_c.canvas.style.width = window.innerWidth + 'px';
c_c.canvas.style.height = window.innerHeight + 'px';



var score;
var score_speed = 10;













function draw_question() {

   c_b.clearRect(0, 0, canvas_b.width, canvas_b.height);
   c_t.clearRect(0, 0, canvas_b.width, canvas_b.height);
   c_c.clearRect(0, 0, canvas_b.width, canvas_b.height);

   if (canvas_t.getContext) {


      if (window.innerWidth > window.innerHeight) {
         var orientation = 'horizontal';
      } else {
         var orientation = 'vertical';
      }

      //the limit where the arc will be placed
      if (orientation == 'horizontal') {
         var right_position = window.innerWidth * 0.8;
      } else {
         var right_position = window.innerHeight * 0.9;
      }


      //randomly choose a radius between min_radius and right_position
      if (orientation == 'horizontal') {
         center_x = min_radius + Math.random() * (right_position - min_radius - min_radius);
         center_y = window.innerHeight / 2;
         radius = right_position - center_x;
      } else {
         center_x = window.innerWidth / 2;
         center_y = min_radius + Math.random() * (right_position - min_radius - min_radius);
         radius = right_position - center_y;
      }
      // console.log('change radius');

      var angle = (min_angle + Math.random() * (max_angle - min_angle)) * Math.PI / 180;



      // c_t.canvas.width = window.innerWidth;
      // c_t.canvas.height = window.innerHeight;

      c_t.beginPath();

      c_t.strokeStyle = 'rgb(255,255,255)';
      c_t.lineWidth = 3;

      //drawing a question
      if (orientation == 'horizontal') {
         c_t.arc(center_x, center_y, radius, -angle, angle, false);
      } else {
         c_t.arc(center_x, center_y, radius, -angle + 90 * Math.PI / 180, angle + 90 * Math.PI / 180, false);
      }

      c_t.stroke();

   }
}

var count = 0;
var score_sum = 0;

function calculate_answer() {
   //error (inverse value) - distance to the center
   var error = Math.sqrt((mouse_x - center_x) * (mouse_x - center_x) + (mouse_y - center_y) * (mouse_y - center_y));

   //as a percentage of the radius
   var error_normalization = 100 * error / radius;
   // console.log('error_normalization:' + error_normalization);

   score = Math.max(100 - error_normalization, 0);
   // console.log('score:' + score);
   count++;
   score_sum += score;
}


function draw_answer() {
   if (canvas_b.getContext) {

      //Drawing a circle 
      // console.log(center_x, center_y, radius);
      c_b.beginPath();
      c_b.strokeStyle = 'rgba(255,255,255, 0.3)';
      c_b.lineWidth = 1;
      c_b.arc(center_x, center_y, radius, 0, 2 * Math.PI, false);  // Mouth (clockwise)
      c_b.stroke();

      //for best average
      if (mode == 1) {
         document.getElementById('score').innerHTML = '<span>' + count + '/' + round_count + '</span> ';

      } else {

      	//safe target area
         c_c.beginPath();
         c_c.fillStyle = 'rgba(57, 181, 74)';
         c_c.arc(center_x, center_y, radius * (100 - score_limit) / 100, 0, 2 * Math.PI);
         c_c.fill();

         document.getElementById('score').innerHTML = '<span>' + count + '</span> ';
      }

      //circle center
      c_b.beginPath();
      c_b.fillStyle = 'rgb(255,255,255)';
      c_b.arc(center_x, center_y, 3, 0, 2 * Math.PI, false);
      c_b.fill();

      //click location
      // console.log('click place ' + mouse_x + ' ' + mouse_y);
      c_b.beginPath();
      c_b.fillStyle = 'rgb(100,100,255)';
      c_b.arc(mouse_x, mouse_y, 5, 0, 2 * Math.PI, false);  // Mouth (clockwise)
      c_b.fill();


   }

}

var state = 0;
var the_end = false;

document.getElementById('reboot').addEventListener('click', function (event) {
	window.location.reload();
	return false;
});

document.addEventListener('click', function (event) {

   if (mode == 1) {

      if (count < round_count) {

         state = (state == 0) ? 1 : 0;


         if (state == 0) { //question
            // console.log('draw');
            draw_question();

         } else { //answer
            // console.log('show results');

            mouse_x = event.clientX;
            mouse_y = event.clientY;
            calculate_answer();
            draw_answer();
         }

      } else {
         document.getElementById('total_score').innerHTML = 'Total score:<br/><span>' + Math.round(score_sum / count) + '</span>';
      }

   } else {


      if (!the_end) {

         state = (state == 0) ? 1 : 0;

         if (state == 0) { //question
            // console.log('draw_question');
            draw_question();


         } else { //answer
            // console.log('show results');
            mouse_x = event.clientX;
            mouse_y = event.clientY;
            // answer();
            calculate_answer();


            // console.log('show results');
            // console.log(score + ' vs ' + score_limit);
            if (score < score_limit) {
               var result = count - 1;
               var let = String(result).length;

               document.getElementById('total_score_value').innerHTML = count - 1;
               document.getElementById('total_score_value').classList.add('l' + let);


               document.getElementById('score').innerHTML = '<span></span> ';
               the_end = true;

               document.getElementById('body').classList.add('the_end');

            } else {
               score_limit += (100 - score_limit) / score_speed;
            }
            draw_answer();

         }

      } else {

      }

   }

});
