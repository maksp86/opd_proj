import Form from 'react-bootstrap/Form'

export default function Switch(props) {
    return (<Form.Check
        type="switch"
        reverse={props.reverse}
        label={props.label}
        className={"font-normal unselectable " + props.className}
        checked={props.value}
        onChange={(e) => props.onChange(e.target.checked)}
    />)
}