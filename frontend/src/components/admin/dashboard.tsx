import { useEffect, useState } from "react";
import api from "../../utils/api";
import Milestone from "./milestones";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

function Dashboard() {
    const [pageData, setPageData] = useState<any>({loaded: false, data: null});

    useEffect(() => {
        api.get("/api/Summary/Get").then(response => {
            if (response?.ok) {
                response.json().then(data => { 
                    console.log(data)

                    data.newUsersPastWeek = data.newUsersPastWeek.map((dataPoint) => {
                        switch (dataPoint.day) {
                            case 0:
                                dataPoint.day = "Today";
                            break;
                            case 1:
                                dataPoint.day = "Yesterday";
                            break;
                            default:
                                dataPoint.day = `${dataPoint.day} days ago`;
                        }
                        return dataPoint;
                    });

                    data.entitiesCreatedPastMonth = data.entitiesCreatedPastMonth.map((dataPoint) => {
                        dataPoint.day = `${dataPoint.day} days ago`;
                        return dataPoint;
                    });

                    setPageData({loaded: true, data: data})
                });
            }
        });
    }, []);

    return (
        pageData.loaded &&
        <div>
            <div className="flex flex-col p-4 gap-3 max-w-7xl w-full items-center">
                <div className="flex flex-row w-full gap-3">
                    <Milestone title="Registered users." value={pageData.data.users} color="#27ae60"/>
                    <Milestone title="Books" value={pageData.data.books} color="#d35400"/>
                    <Milestone title="Pages." value={pageData.data.pages} color="#f1c40f"/>
                    <Milestone title="Note blocks." value={pageData.data.blocks} color="#8e44ad"/>
                    <Milestone title="Files." value={pageData.data.files} color="#2c3e50"/>
                </div>
                <div className="flex flex-row w-full gap-3 h-[28rem]">
                    <div className="flex flex-col w-full bg-white border border-solid border-gray-300 rounded">
                        <div className='flex justify-between bg-zinc-100 border-0 border-b border-solid border-gray-200 ps-2'>
                            <span className='text-lg font-semibold text-neutral-500 my-0'>New users past 7 days</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pageData.data.newUsersPastWeek}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis fontSize="13px" dataKey="day" />
                                <YAxis width={15} fontSize="14px" allowDecimals={false} />
                                <Tooltip />
                                <Legend layout="horizontal" verticalAlign="top" align="center" formatter={(value, entry, index) => <span className="text-neutral-600">{value}</span>} />
                                <Bar name="Users" dataKey="users" stroke="#27ae60" fill="#27ae60" fillOpacity={0.4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col w-full bg-white border border-solid border-gray-300 rounded">
                        <div className='flex justify-between bg-zinc-100 border-0 border-b border-solid border-gray-200 ps-2'>
                            <span className='text-lg font-semibold text-neutral-500 my-0'>New entities</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                            width={100}
                            height={40}
                            data={pageData.data.entitiesCreatedPastMonth}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                            >
                            <Legend layout="horizontal" verticalAlign="top" formatter={(value, entry, index) => <span className="text-neutral-600">{value}</span>} align="center" />
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" height={60} interval={0} angle={-45} textAnchor="end" fontSize="12px" />
                            <YAxis fontSize="14px" width={45} tickCount={10} allowDecimals={false}/>
                            <Tooltip />
                            <Area type="monotone" name="Users" dataKey="users" stroke="#27ae60" fill="#27ae60" fillOpacity={0.2} dot={{ fill: "#27ae60", fillOpacity: 1, strokeWidth: 1, r: 4,strokeDasharray:''}}/>
                            <Area type="monotone" name="Books" dataKey="books" stroke="#d35400" fill="#d35400" fillOpacity={0.2} dot={{ fill: "#d35400", fillOpacity: 1, strokeWidth: 1, r: 4,strokeDasharray:''}} />
                            <Area type="monotone" name="Pages" dataKey="pages" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} dot={{ fill: "#ffc658", fillOpacity: 1, strokeWidth: 1, r: 4,strokeDasharray:''}} />
                            <Area type="monotone" name="Blocks" dataKey="blocks" stroke="#8e44ad" fill="#8e44ad" fillOpacity={0.2} dot={{ fill: "#8e44ad", fillOpacity: 1, strokeWidth: 1, r: 4,strokeDasharray:''}} />
                            <Area type="monotone" name="Files" dataKey="files" stroke="#2980b9" fill="#2980b9" fillOpacity={0.2} dot={{ fill: "#2980b9", fillOpacity: 1, strokeWidth: 1, r: 4,strokeDasharray:''}} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;