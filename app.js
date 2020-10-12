// define some global variable
let name;
let pokemonArray;
let currentPokeData;

// fetch the infos from pokemon api this website
window.addEventListener('load', function() {
    console.log("blur image");
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151/")
        .then(response => response.json())
        .then(data => {
            pokemonArray = data.results;
            console.log(pokemonArray);
            let randomNumber = Math.floor(Math.random() * pokemonArray.length);
            console.log(randomNumber);
            let nameElement = document.getElementById('pokemon-name');
            console.log(data.results[randomNumber].name);
            name = data.results[randomNumber].name;
            let API_URL = "https://pokeapi.co/api/v2/pokemon/" + name;
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    currentPokeData = data;
                    document.getElementById('blur-image').src = data.sprites.front_default;

                })
        })
})

// is this called Boolean function?
let isGuessed = false;

let button = document.getElementById('pokemon-button');
button.addEventListener('click', function() {
    // get the text user typed in
    let inputText = document.getElementById("pokemon_input").value;

    //Is the user input correct?
    if (inputText == name) {
        console.log("Hooray!");
        //code that should run when the user gets the right answer
        // let pokemon image turn to clean
        document.getElementById('blur-image').classList.remove("blur");


        $("#pokemon-button").css('display', 'none');
        $("#reset").css('display', 'inline-block');
        // show the infos about this pokemon
        let abilitiesElement = document.getElementById('p_abilities');
        let abilities = currentPokeData.abilities;
        for (let i = 0; i < currentPokeData.abilities.length; i++) {
            let elt = document.createElement('p');
            elt.innerHTML = currentPokeData.abilities[i].ability.name;
            abilitiesElement.appendChild(elt);
        }

        let headingElement = document.getElementById('p_name');
        headingElement.innerHTML = currentPokeData.name;

        let weightElement = document.getElementById('p_weight');
        weightElement.innerHTML = " WEIGHT: " + currentPokeData.weight;

        let heightElement = document.getElementById('p_height');
        heightElement.innerHTML = " HEIGHT: " + currentPokeData.height;


        let typesElement = document.getElementById('p_types');
        let types = currentPokeData.types;
        for (let i = 0; i < currentPokeData.types.length; i++) {
            let elt = document.createElement('p');
            elt.innerHTML = currentPokeData.types[i].type.name;
            typesElement.appendChild(elt);
        }

        let idElement = document.getElementById('p_id');
        idElement.innerHTML = " NO: " + currentPokeData.id;
        // if user get a wrong answer,tell them sorry please try again
    } else {
        console.log("Sorry. Try again!");

        let headingElement = document.getElementById('p_name');

        $('#p_name').html('<p>Sorry~</p><p>Please try again~</p>')
        let weightElement = document.getElementById('p_weight');
        weightElement.innerHTML = '';

        let imageElement = document.getElementById('p_image');
        imageElement.src = '';
    }
});

// !!!!!!!!!!!!!!!from here is for the p5.js
// https://editor.p5js.org/p5/sketches/Hello_P5:_drawing

// All the paths
let paths = [];
// Are we painting?
let painting = false;
// How long until the next circle
let next = 0;
// Where are we now and where were we?
let current;
let previous;


function setup() {
    createCanvas(1920, 1080);
    current = createVector(0, 0);
    previous = createVector(0, 0);
}

function draw() {
    background(239, 236, 225);

    // If it's time for a new point
    if (millis() > next && painting) {

        // Grab mouse position      
        current.x = mouseX;
        current.y = mouseY;

        // New particle's force is based on mouse movement
        let force = p5.Vector.sub(current, previous);
        force.mult(0.05);

        // Add new particle
        paths[paths.length - 1].add(current, force);

        // Schedule next circle
        next = millis() + random(100);

        // Store mouse values
        previous.x = current.x;
        previous.y = current.y;
    }

    // Draw all paths
    for (let i = 0; i < paths.length; i++) {
        paths[i].update();
        paths[i].display();
    }
}
// Start it up
function mousePressed() {
    next = 0;
    painting = true;
    previous.x = mouseX;
    previous.y = mouseY;
    paths.push(new Path());
}

// Stop
function mouseReleased() {
    painting = false;
}

// A Path is a list of particles
class Path {
    constructor() {
        this.particles = [];
        this.hue = random(100);
    }

    add(position, force) {
        // Add a new particle with a position, force, and hue
        this.particles.push(new Particle(position, force, this.hue));
    }

    // Display plath
    update() {
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].update();
            }
        }
        // Display plath
    display() {
        // Loop through backwards
        for (let i = this.particles.length - 1; i >= 0; i--) {
            // If we shold remove it
            if (this.particles[i].lifespan <= 0) {
                this.particles.splice(i, 1);
                // Otherwise, display it
            } else {
                this.particles[i].display(this.particles[i + 1]);
            }
        }

    }
}

// Particles along the path
class Particle {
    constructor(position, force, hue) {
        this.position = createVector(position.x, position.y);
        this.velocity = createVector(force.x, force.y);
        this.drag = 0.95;
        this.lifespan = 255;
    }

    update() {
            // Move it
            this.position.add(this.velocity);
            // Slow it down
            this.velocity.mult(this.drag);
            // Fade it out
            this.lifespan--;
        }
        // Draw particle and connect it with a line
        // Draw a line to another
    display(other) {
        stroke(0, this.lifespan);
        fill(0, this.lifespan / 2);
        ellipse(this.position.x, this.position.y, 8, 8);
        // If we need to draw a line
        if (other) {
            line(this.position.x, this.position.y, other.position.x, other.position.y);
        }
    }

}