const VISITED = localStorage.getItem("visited");
const GUAVA = document.getElementById("guava").firstElementChild.firstElementChild; // bc of evil container wrapping
const KIWI = document.getElementById("kiwi");
const GUAVA2 = document.getElementById("guava2");
const TEXT_SPEED = 50;
const SCENES = document.querySelectorAll(".skit").length;

// its useful to pair dialogue with functions in case something needs to happen at the same time a line of dialogue is read
// i use this elsewhere, and since its a useful """paradigm""" i figured id explain it
const DIALOGUE =  VISITED ? [
    ["Choose..."],
] : [
    ["Okay..."],
    // can do a funny text and arrow here
    ["...what? Oh, sorry, I'm Guava.\nThis is not my website."],
    ["Officially, I'm the webmaster,\nwhich means something, I think."],
    ["It definitely looks good on a resume.\nSpeaking of resumes..."],
    ["This is not a walking talking resume.\nIt's barely a portfolio."],
    ["So, if that's what you're here for...\nWell, here you go."],
    ["And if that's not what you're here for...\nYou'll get to meet Kiwi!"],
    ["Who's currently hard at work getting things ready.\nI think.", (char) => {
        if (char == '.') {
            setTimeout(() => {
                document.getElementById("right").style.visibility = "visible";
            }, 250);
        }
    }],
    ["I assume at this point you're wondering\nwhat this \"website\" is."],
    ["Well, that depends.\nWhat do you want it to be?"],
];
const RESPONSES = VISITED ? [
    "<span class=\"next\" onclick=\"load_simple()\" id=\"simple\">[←] simple</span>&emsp;&emsp;<span class=\"next\" onclick=\"load_complex()\" id=\"complex\">[→] lots of STUFF!</span>"
] : [
    "<span class=\"next\" onclick=\"advance()\">[↑] to continue</span>&emsp;&emsp;<span class=\"next\" onclick=\"skip_dialogue()\">[Enter] to skip</span>",
    "<span class=\"next\" onclick=\"advance()\">[↑]</span>",
    "<span class=\"next\" onclick=\"advance()\">[↑]</span>",
    "<span class=\"next\" onclick=\"advance()\">[↑]</span>",
    "<span class=\"next\" onclick=\"advance()\">[↑]</span>",
    "<span class=\"next\" onclick=\"advance()\">[↑]</span>",
    "<span class=\"next\" onclick=\"advance()\">[↑]</span>",
    "<span class=\"next\" onclick=\"advance()\">[↑]</span>",
    "<span class=\"next\" onclick=\"advance()\">[↑]</span>",
    "<span class=\"next\" onclick=\"load_simple()\" id=\"simple\">[←] simple</span>&emsp;&emsp;<span class=\"next\" onclick=\"load_complex()\" id=\"complex\">[→] lots of STUFF!</span>"
];

let CURRENT_DIALOGUE = 0;
let TIMEOUTS = [];
let MODE = 0; // light / dark
let CURRENT_SCENE = 0;

// play typewriter effect on text
function type(line, name) {
    const text = line[0];
    document.getElementById(name).innerHTML = "";
    let delay = 0;
    for(let i=0; i<text.length; i++) {
        const t = setTimeout(() => {
            document.getElementById(name).innerHTML += text[i] == "\n" ? "<br/>" : text[i];
            if(name == "text") {
                line[1]?.(text[i])
            }
        }, delay + TEXT_SPEED * i);
        
        if(i != text.length-1) {
            if((text[i] == "." || text[i] == "!" || text[i] == "?" || text[i] == "*") && (i == text.length-1 || text[i+1] == " " || text[i+1] == "\n")) {
                delay += 500;
            } else if((text[i] == ")" || text[i] == "'") && text[i-1] == ".") {
                delay += 500;
            } else if(text[i] == ",") {
                delay += 250;
            }
        }
        
        TIMEOUTS.push(t);
    }

    return delay + text.length * TEXT_SPEED;
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function load_intro_cutscene() {
    document.removeEventListener("keydown", progress);

    GUAVA.src = `images/guava/guava_${CURRENT_DIALOGUE}_talk.gif`;
    const duration = type(["Okay!"], "text");
    setTimeout(() => {
        GUAVA.src = `images/guava/guava_${CURRENT_DIALOGUE}.gif`;
    }, duration);
    document.getElementById("indicator").style.display = "none";
    document.getElementById("loading").style.display = "block";

    setTimeout(() => {
        document.getElementById("loading").style.animation = "fall 1s ease-in forwards";
        GUAVA.src = `images/guava/guava_${CURRENT_DIALOGUE+1}.gif`
    }, 2500 + duration);

    setTimeout(() => {
        GUAVA.src = `images/guava/guava_${CURRENT_DIALOGUE+1}_talk.gif`;
        type(["...uh, that's not supposed to happen."], "text");
    }, 3500 + duration);
    setTimeout(() => {
        document.getElementById("page").style.animation = "fill 1.5s ease-in-out forwards";
    }, 4500 + duration);

    setTimeout(() => {
        document.getElementById("intro").remove(); // lets not clutter things up too much
        document.getElementById("title").style.animation = "pop 0.2s steps(1) forwards";
        document.querySelectorAll(".navitem").forEach((el, i) => {
            el.style.animation = `pop 0.1s ${0.5 + i * 0.1}s steps(1) forwards`;
        });
        document.getElementById("copyright").style.animation = "pop 0.2s 1s steps(1) forwards";
    }, 6000 + duration);

    setTimeout(() => {
        KIWI.src = "images/kiwi/kiwi_2.gif";
        KIWI.style.animation = "fly 1s ease forwards";
    }, 7000 + duration);

    // this is a travesty
    await delay(8000 + duration);

    const selectlink = (link) => {
        return () => {
            const item = document.getElementById(link);
            item.style.marginLeft = "auto";
            item.innerHTML = `>> ${item.innerHTML}`;
        }
    }

    const kiwitext = [
        ["omggg hello welcome to my website!"],
        ["here's some stuff about me", selectlink("about")],
        ["here's what i've been working on", selectlink("projects")],
        ["this is my awesome screenplay", selectlink("scripts")],
        ["this is where i complain about things", selectlink("blog")],
        ["and you can find me here!", selectlink("contact")],
    ];
    for (const line of kiwitext) {
        const duration = type([line[0]], "text2");
        document.querySelectorAll(".navitem").forEach((el) => {
            el.style.marginLeft = "0";
            el.innerHTML = `${el.id}`;
        });
        line[1]?.();
        await delay(duration + 50);
    }

    document.querySelectorAll(".navitem").forEach((el, i) => {
        el.style.marginLeft = "0";
        el.innerHTML = `${el.id}`;
    });

    // await delay(500);

    document.getElementById("guava2").src = `images/guava/guava_${DIALOGUE.length + 2}.gif`;
    document.getElementById("guava2").style.animation = "popup 1s ease forwards";

    await delay(500);

    // [text, character, function?] so we know who's talking
    const dialogue = [
        ["Kiwi, they said they wanted simple!", 0],
        ["THIS IS NOT SIMPLE!!!", 0],
        ["i don't know, it's pretty simple.", 1],
        ["I told you not to break anything!", 0],
        ["as a developer, that's my job--", 1],
        ["Now it's your job to clean it up!", 0],
        ["oh! like this?", 1, () => {
            document.getElementById("css").href = "styles/barebones.css";
        }],
        ["No, Kiwi. Not like that.", 0],
        ["Stop messing around!\nWhat if a recruiter's looking?", 0],
        ["oh, im sorry. i forgot how much recruiters love wading through vibecoded slop.", 1],
        ["they dont look at these anymore. so if you wanna blame someone, blame AI--", 1],
        ["Kiwi. Just fix it.", 0],
        ["ugh, fine. but, just so you know...", 1],
        ["the experience stopped being \"simple\" the moment they had to read dialogue.", 1],
    ];

    for (const line of dialogue) {
        const cut_dialouge = line[0].endsWith("--") ? line[0].slice(0, -2) : line[0];
        const duration = type([cut_dialouge], line[1] == 0 ?  "text3" : "text2");
        line[2]?.();
        // traditionally em dashes indicate interruption in dialogue so we'll emulate by skipping the delay
        await delay(duration + (line[0].endsWith("--") ? 0 : 500));
    }
}

// loading page for simple version of site
async function load_simple() {
    if (!VISITED) {
        await load_intro_cutscene();
        localStorage.setItem("visited", true);
    } else {
        document.getElementById("title").style.animation = "pop 0.2s steps(1) forwards";
        document.querySelectorAll(".navitem").forEach((el, i) => {
            el.style.animation = `pop 0.1s ${0.5 + i * 0.1}s steps(1) forwards`;
        });
        document.getElementById("copyright").style.animation = "pop 0.2s 1s steps(1) forwards";
    }

    document.getElementById("css").href = "styles/intro.css";
    document.getElementById("page").style.animation = "";
    document.getElementById("page").style.transform = "translateX(0)";
    KIWI.remove();
    GUAVA2.remove();
    document.getElementById("rainbowcontainer").remove();
    document.getElementById("main").style.visibility = "visible";
    document.getElementById("page").style.setProperty("--text-shadow", "var(--bg-accent)");
    document.getElementById("title").innerHTML = "deccan<br/>&nbsp;.rocks";
    // document.getElementById("title").innerHTML = "web<br/>&nbsp;world";
    document.getElementById("copyright").innerHTML = "(c) 2026 Deccan. All Rights Reserved.";
    document.getElementsByTagName("title")[0].innerHTML = "deccan.rocks";
    document.getElementById("favicon").href = "images/favicon2.ico";
    document.getElementById("text2").innerHTML = "";
    document.getElementById("text3").innerHTML = "";
    document.querySelectorAll(".scene")[CURRENT_SCENE].style.visibility = "visible";

    const scene_handler = {
        "projects": () => {
            document.getElementById("projectsscene").style.visibility = "visible";
            window.scrollTo({
                top: 0,
                behavior: "instant",
            });
            document.querySelectorAll(".laptop").forEach((el) => {
                el.style.transform = "rotateY(calc(45deg*(var(--i) + 4))) translateZ(60vh)";
                const intro_spin = el.animate([
                    {
                        transform: "rotateY(calc(45deg*(var(--i) + 4))) translateZ(60vh)",
                    }, {
                        transform: "rotateY(calc(45deg*var(--i))) translateZ(60vh)",
                    }
                ], {
                    duration: 500,  
                    fill: "forwards",
                    easing: "ease-out",
                });

                intro_spin.onfinish = () => {
                    intro_spin.cancel();
                    window.scrollTo({
                        top: 0,
                        behavior: "instant",
                    });
                }
            });
            // theres room for better laptop z-index switching code here...

            // const screen = document.getElementById("screen");
            // screen.style.transform = "translateZ(-20vh) rotateX(-90deg)";
            // screen.animate([
            //     {
            //         transform: "translateZ(-20vh) rotateX(-90deg)",
            //     }, {
            //         transform: "translateZ(-20vh) rotateX(15deg)",
            //     }
            // ], {
            //     duration: 500,
            //     fill: "forwards",
            //     easing: "ease-out",
            // });
        },
        "contact": () => {
            document.getElementById("contactscene").style.visibility = "visible";
            const contactform = document.getElementById("contactform");
            contactform.style.transform = "translateY(-50px)";
            contactform.animate([
                {
                    transform: "translateY(-50px)",
                    opacity: 0,
                }, {
                    transform: "translateY(0)",
                    opacity: 1,
                }
            ], {
                duration: 500,
                fill: "forwards",
                easing: "ease-out",
            });
        },
    }

    const select = (e) => {
        document.querySelectorAll(".navitem").forEach((el) => {
            el.style.marginLeft = "0";
            el.innerHTML = `${el.id}`;
            el.style.pointerEvents = "auto";
        });

        document.querySelectorAll(".scene").forEach((el2) => {
            el2.style.visibility = "hidden";
        });
            
        if(e.target.id != "title") {
            e.target.style.marginLeft = "auto";
            e.target.innerHTML = `>> ${e.target.innerHTML}`;
            e.target.style.pointerEvents = "none";
            scene_handler[e.target.id]();
        } else {
            document.querySelectorAll(".skit")[(CURRENT_SCENE = (CURRENT_SCENE + 1)%SCENES)].style.visibility = "visible";
        }
    }

    document.querySelectorAll(".navitem").forEach((el) => {
        el.addEventListener("click", select);
    });
    document.getElementById("title").addEventListener("click", select);
}

// i think you can extrapolate what this does
async function load_complex() {
    document.removeEventListener("keydown", progress);

    GUAVA.src = `images/guava/guava_${CURRENT_DIALOGUE}_talk.gif`;
    document.getElementById("indicator").style.display = "none";
    const guavatext = [
        ["Okay, actually, this part's not done yet."],
        ["We'll let you when it's ready."],
        ["I'm not sure how."],
        ["Maybe we'll set up a mailing list."],
        ["...we'll let you know when that's ready."]
    ];
    for (const line of guavatext) {
        const duration = type(line, "text");
        await delay(duration + 1000);
    }

    GUAVA.src = `images/guava/guava_${CURRENT_DIALOGUE}.gif`;
    setTimeout(() => {
        load_simple();
    }, 1000);

    // document.getElementById("loading").style.display = "block";
    // setTimeout(() => {
    //    document.getElementById("page").style.animation = "fill 1s ease-in-out forwards";
    // }, 500 + duration);
}

function skip_dialogue() {
    TIMEOUTS.forEach((t) => {
        clearTimeout(t);
    });
    document.getElementById("text").innerHTML = DIALOGUE[DIALOGUE.length - 1][0].split("\n").join("<br/>");
    document.getElementById("indicator").innerHTML = RESPONSES[DIALOGUE.length - 1];
    document.getElementById("indicator").style.visibility = "visible";
    document.addEventListener("keydown", progress);
    document.getElementById("right").style.visibility = "hidden";
    GUAVA.src = VISITED ? "images/guava/guava_13.gif" : `images/guava/guava_${DIALOGUE.length-1}.gif`;
    CURRENT_DIALOGUE = DIALOGUE.length;
}

// skip to the choice dialogue
function skip(e) {
    if(e.key == "Enter" && CURRENT_DIALOGUE < DIALOGUE.length) {
        // im so excited to get to use this operator
        document.getElementById("sign")?.remove();
        document.getElementById("sign2")?.remove();
        skip_dialogue();
    }
}

// handle progression to the next dialogue
function progress(e) {
    if(e.key == "ArrowUp" && CURRENT_DIALOGUE < DIALOGUE.length) {
        advance();
    } else if(CURRENT_DIALOGUE == DIALOGUE.length) {
        if(e.key == "ArrowRight") {
            load_complex();
        } else if(e.key == "ArrowLeft") {
            load_simple();
        }
    }
}

// run entire dialogue sequence
function advance() {
    document.getElementById("right").style.visibility = "hidden";
    GUAVA.src = VISITED ? "images/guava/guava_13_talk.gif" : `images/guava/guava_${CURRENT_DIALOGUE}_talk.gif`;
    const duration = type(DIALOGUE[CURRENT_DIALOGUE], "text");
    const t1 = setTimeout(() => {
        GUAVA.src = VISITED ? "images/guava/guava_13.gif" : `images/guava/guava_${CURRENT_DIALOGUE}.gif`;
    }, duration);
    TIMEOUTS.push(t1);

    // TODO: press arrow again to skip dialogue

    document.getElementById("indicator").style.visibility = "hidden";
    document.getElementById("indicator").innerHTML = RESPONSES[CURRENT_DIALOGUE];
    document.removeEventListener("keydown", progress);
    const t2 = setTimeout(() => {
        CURRENT_DIALOGUE++;
        document.getElementById("indicator").style.visibility = "visible";
        document.addEventListener("keydown", progress);
    }, 500 + duration);
    TIMEOUTS.push(t2);
}

function start() {
    GUAVA.onclick = "";
    GUAVA.style.pointerEvents = "none";
    GUAVA.src = "images/guava/guava_wake.gif";
    document.getElementById("sign").style.animation = "spin2 10s steps(72, end) infinite, leave 0.3s ease-out forwards, leave2 0.6s 0.3s ease-in forwards, jiggle 0.9s linear forwards";
    document.getElementById("sign2").style.animation = "spin3 10s steps(72, end) infinite, leave 0.3s ease-out forwards, leave2 0.6s 0.3s ease-in forwards, jiggle 0.9s linear forwards";
    setTimeout(() => {
        document.getElementById("sign").remove();
        document.getElementById("sign2").remove();
    }, 900);
    setTimeout(() => {
        advance();
    }, 3625);
}

function toggle_mode() {
    MODE = 1 - MODE;
    document.getElementById("switch").src = MODE == 0 ? "images/switch_on.png" : "images/switch_off.png";
    document.getElementById("page").classList.toggle("dark");
}

window.onload = () => {
    toggle_mode();
    
    if (VISITED) {
        document.getElementsByTagName("title")[0].innerHTML = "deccan.rocks";
        document.getElementById("favicon").href = "images/favicon2.ico"; // something different initially?
        // TODO: skip wakeup
    }
    document.addEventListener("keydown", skip);
}