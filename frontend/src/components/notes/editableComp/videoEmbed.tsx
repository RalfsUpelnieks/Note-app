function VideoEmbed(props: any){
    return (
        <div>
            <iframe width="560" height="315" src={props.startingProperties.text} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </div>
    )
}

export default VideoEmbed;