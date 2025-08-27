/*
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port =3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/",(req,res)=>{
    res.render("index.ejs");

});

app.listen(port,()=>{
    console.log("server is running at port "+port);
});*/

/*import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app=express();
const port=3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({
    secret: 'pomodoroSecret',
    resave: false,
    saveUninitialized: true
}))

app.get("/",(req,res)=>{
    res.render("index.ejs",{
        remainingtime : Math.floor(req.session.remainingtime ?? 0)

    });

});



app.post("/savedtime",(req,res)=>{

    

    let hour =parseInt(req.body.hour || 0);
    let minute=parseInt(req.body.Minute || 0);
    let second=parseInt(req.body.Second || 0);
    let totalsecs = hour*3600+minute*60+second;
    let displaytime ;
    req.session.remainingtime ;
    console.log("total seconds user chose : "+totalsecs);
    if (req.body.action==="start"){
            req.session.starttime=Date.now();
        if(req.session.remainingtime){ //if still got time  then use this continue else ntg
            displaytime= req.session.remainingtime;
            console.log("user start from remaining time : "+displaytime);
        }else{
            displaytime= totalsecs;
            console.log("user start again because remaining time has become 0"+totalsecs);
        }


    }else if(req.body.action==="pause"){
            req.session.pausetime=Date.now();
            console.log("session pause ")
    }else if(req.body.action==="reset"){
            req.session.remainingtime=0;
            console.log("remaining time setted to "+req.session.remainingtime);
    }

    let timeelapsed = (req.session.pausetime - req.session.starttime)/1000;
    req.session.remainingtime = totalsecs - timeelapsed;
    

    res.redirect("/");

})

app.listen(port,()=>{
    console.log("listeinig on port "+port);
});

*/
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'pomodoroSecret',
    resave: false,
    saveUninitialized: true
}));

app.get("/", (req, res) => {
    // Initialize session values if they don't exist
    if (!req.session.remainingtime) req.session.remainingtime = 0;
    if (!req.session.isRunning) req.session.isRunning = false;
    
    res.render("index.ejs", {
        remainingtime: Math.floor(req.session.remainingtime || 0),
        isRunning: req.session.isRunning || false,
        pausetime : req.session.pausetime || false
    });
});

app.post("/savedtime", (req, res) => {
    const hour = parseInt(req.body.hour || 0);
    const minute = parseInt(req.body.Minute || 0);
    const second = parseInt(req.body.Second || 0);
    const totalSeconds = hour * 3600 + minute * 60 + second;
    
    console.log("Action:", req.body.action);
    console.log("Total seconds from input:", totalSeconds);
    
    if (req.body.action === "start") {
        // If timer is already running, continue from remaining time
        if (req.session.remainingtime > 0) {
            console.log("Continuing timer with remaining time:", req.session.remainingtime);
        } else {
            // Start new timer with user input
            req.session.remainingtime = totalSeconds;
            console.log("Starting new timer with:", totalSeconds, "seconds");
        }
        
        req.session.starttime = Date.now();
        req.session.isRunning = true;
        req.session.pausetime = null;
        
    } else if (req.body.action === "pause") {
        if (req.session.isRunning) {
            // Calculate how much time has elapsed since start
            const currentTime = Date.now();
            const timeElapsed = (currentTime - req.session.starttime) / 1000;
            
            // Update remaining time
            req.session.remainingtime = Math.max(0, req.session.remainingtime - timeElapsed);
            req.session.pausetime = currentTime;
            req.session.isRunning = false;
            
            console.log("Timer paused. Time elapsed:", timeElapsed, "Remaining:", req.session.remainingtime);
        }
        
    } else if (req.body.action === "reset") {
        req.session.remainingtime = 0;
        req.session.isRunning = false;
        req.session.starttime = null;
        req.session.pausetime = null;
        console.log("Timer reset");
    }
    
    res.redirect("/");
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});