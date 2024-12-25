const VideoPlayer = ({ className, width = "100%", height = "100%", src, props }) => {
    return (
        <iframe className={ className } width={ width } height={ height } src={ src } { ...props } />
    )
};

export default VideoPlayer;
