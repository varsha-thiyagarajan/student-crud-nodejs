const express=require("express")
const mysql=require("mysql2")
const cors=require("cors")

const app=express()
app.use(cors())
app.use(express.json())


const db = mysql.createConnection({
    host: "localhost",
    user: "root",      
    password: "1207",      
    database: "StudentDB"
});


app.get("/student/:name",(req,res)=>
{
    const name=req.params.name
    db.query("SELECT * FROM Students WHERE Name=?",[name],(err,result)=>
    {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Student not found" });
        res.json(result[0]); 
    })


})
app.post("/add", (req, res) => {
    const { id, name, age, department, grade } = req.body;
    const sql = "INSERT INTO Students (StudentID, Name, Age, Department, Grade) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [id, name, age, department, grade], (err, result) => {
        if (err) {
            console.error("DB Error:", err);   
            return res.status(500).json({ error: err.message });
        }
        res.json({ 
            message: "Student added successfully!", 
            student: { id, name, age, department, grade } 
        });
    });
});
app.post("/update",(req,res)=>
{
    const{update,from,to}=req.body
     const sql = `UPDATE Students SET ${update} = ? WHERE ${update} = ?`;
    db.query(sql,[to,from],(err,result)=>
    {
        if(err)
        {
            return res.status(500).json({error:err.message})
        }
        res.json({
            message: `✅ ${update} updated from "${from}" to "${to}" successfully`,
            
        })
    })
})
app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Students WHERE StudentID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "🗑️ Student deleted successfully!" });
    });
});

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});