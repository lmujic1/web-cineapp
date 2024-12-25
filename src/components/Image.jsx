const Image = ({ className, src, width = "100%", height = "100%", alt = "Image", props }) => {
    return (
        <img src={ src } className={ className } width={ width } height={ height } alt={ alt } { ...props } />
    )
}

export default Image;
