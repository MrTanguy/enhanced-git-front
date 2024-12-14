
const Dashboard = () => {

    return(
        <div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ fontSize: "30px" }}>Connexions</div>
                <div style={{ width: "20%", backgroundColor: "#739BF2", height: "5px", borderRadius: "20px"}}></div>
            </div>
            <div style={{ margin: "1% 3%", display:"flex", flexWrap: "wrap", gap: "16px", justifyContent:"center" }} >
                <div style={{ border:"2px solid #739BF2", width:"150px", height:"200px", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"20px"}} >
                    <img src="/plus.svg" style={{ width: "50%", height: "50%", objectFit: "fill" }} alt='PlusSVG'/>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ fontSize: "30px" }}>Portfolios</div>
                <div style={{ width: "20%", backgroundColor: "#739BF2", height: "5px", borderRadius: "20px"}}></div>
            </div>
        </div>    
    )  
}

export default Dashboard;