import { Form, InputGroup } from "react-bootstrap"
import { useEffect, useState } from "react";

function PermissionsRow(props) {
    return (
        <InputGroup size="sm" className="mb-2" hasValidation>
            <InputGroup.Text>{props.title}: </InputGroup.Text>

            <InputGroup.Text>
                <Form.Check
                    disabled={!!props.disabled}
                    isInvalid={!!props.isInvalid}
                    
                    checked={props.value & 0o4}
                    onChange={(e) => props.onChange(e.target.checked ? props.value | 0o4 : props.value ^ 0o4)}
                    label="Read" />
            </InputGroup.Text>

            <InputGroup.Text>
                <Form.Check
                    disabled={!!props.disabled}
                    isInvalid={!!props.isInvalid}
                    
                    checked={props.value & 0o2}
                    onChange={(e) => props.onChange(e.target.checked ? props.value | 0o2 : props.value ^ 0o2)}
                    label="Write" />
            </InputGroup.Text>

            <InputGroup.Text>
                <Form.Check
                    disabled={!!props.disabled}
                    isInvalid={!!props.isInvalid}
                    
                    checked={props.value & 0o1}
                    onChange={(e) => props.onChange(e.target.checked ? props.value | 0o1 : props.value ^ 0o1)}
                    label="Execute" />
            </InputGroup.Text>
        </InputGroup>
    )
}

function PermissionsSelector(props) {
    const [permissions, setPermissions] = useState([7, 0, 0])

    useEffect(() => {
        if (props.value && props.value !== permissions.join('')) {
            // console.log("PermissionsSelector got value", props.value)
            setPermissions(props.value && props.value.split("").map((char) => parseInt(char)))
        }

    }, [props.value, permissions])

    function setPermissionsValue(index, value) {
        if (props.onChange) {
            let newValue = permissions.map((val, ind) => ind == index ? value : val).join("")
            // console.log("PermissionsSelector sent value", newValue)
            props.onChange(newValue)
        }
    }

    return (
        <Form.Group className="mx-2">
            <Form.Label>Permissions <b className="text-danger">{props.error}</b></Form.Label>
            <PermissionsRow
                title="Creator"
                disabled={false}
                isInvalid={!!props.isInvalid}
                value={permissions[0]}
                onChange={(e) => setPermissionsValue(0, e)} />
            <PermissionsRow
                title="Same role"
                isInvalid={!!props.isInvalid}
                disabled={!!props.disabled}
                value={permissions[1]}
                onChange={(e) => setPermissionsValue(1, e)} />
            <PermissionsRow
                title="Others"
                isInvalid={!!props.isInvalid}
                disabled={!!props.disabled}
                value={permissions[2]}
                onChange={(e) => setPermissionsValue(2, e)} />
        </Form.Group>
    )
}

export default PermissionsSelector