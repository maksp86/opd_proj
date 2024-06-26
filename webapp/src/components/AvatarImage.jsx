import { Image } from "react-bootstrap"
import { PersonFill } from "react-bootstrap-icons"

function AvatarImage(props) {
    if (props.avatar)
        return (
            <Image
                className={"" + props.className}
                roundedCircle
                src={"/api/attachments/get?id=" + props.avatar}
                style={{ backgroundColor: "#000", ...props.style }} />
        )
    else
        return (
            <PersonFill
                className={`p-2 rounded-circle fallbackPersonAvatar ${props.className}`}
                style={{ ...props.style }} />
        )
}

export default AvatarImage