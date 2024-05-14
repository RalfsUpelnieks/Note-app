function Milestone({title, value, color}) {
    const MILESTONES = [
        10,
        25,
        50,
        75,
        100,
        150,
        200,
        300,
        400,
        500,
        750,
        1000
    ]

    let nextMilestone = MILESTONES.find(milestone => milestone > value);
    let milestonesRemaining;
    if(nextMilestone == undefined){
        milestonesRemaining = 0;
        nextMilestone = value;
    }
    else {
        milestonesRemaining = nextMilestone! - value;
    }

    return (
        <div style={{background: color}} className="text-white px-3 pt-1 pb-3 rounded w-full">
            <h2 className="m-0 font-semibold">{value}</h2>
            <h4 className="font-normal m-0">{title}</h4>
            <progress value={value / nextMilestone!} style={{backgroundColor: color}} className={`w-full mb-1 progress-unfilled:brightness-[1.15] progress-filled:bg-white progress-filled:rounded-2xl progress-filled:h-1 progress-filled:border-none`} ></progress>
            <p className="text-xs opacity-90 m-0">{milestonesRemaining} more until next milestone.</p>
        </div>
    );
}

export default Milestone;