import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import DashboardRh from "../dashboardRh";

const HomeVideoRh = () => {
    const [value, setValue] = useState("");
    const navigate = useNavigate();

    const handleJoinRoom = useCallback(() => {
        navigate(`/roomRh/${value}`);
    }, [navigate, value]);

    return (
        <>
            <DashboardRh />
            <div className="container-fluid">
                <div className="row">
                    <div className="col d-flex justify-content-center align-items-center min-vh-100">
                        <div className="card p-4 shadow" style={{ width: "600px", height: '300px' , marginBottom: '170px', marginLeft:'250px'}}>
                            <h2 className="mb-4 text-center">Rejoindre une salle de réunion</h2>

                            <div className="input-group mb-3">
                                <input
                                style={{marginTop:'30px'}}
                                    type="text"
                                    className="form-control"
                                    placeholder="Entrer le code"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>

                            <div className="d-grid gap-2" style={{ marginTop: '40px', width: '350px', marginLeft: '90px' }}>
                                <button
                                style={{marginLeft:'40px', backgroundColor:'#3C91E6'}}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={handleJoinRoom}
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeVideoRh;
