import { React, useState } from "react";

const InputLinks = () => {
    const [countLinks, setCountLinks] = useState([0]);

    // control links
    const addInputLinks = () => {
        let countArr = [...countLinks]
        let counter = countArr.slice(-1)[0]

        counter += 1
        countArr.push(counter)
        setCountLinks(countArr)
        addLinksArray()
    }

    const addLinksArray = () => {
        const newLink = {
            id: links.length,
            name: '',
            URL: ''
        }
        setLinks(links.concat(newLink))
        //console.log(links)
    }

    const subInputLinks = () => {
        let countArr = [...countLinks]
        countArr.pop()
        if (links.length <= 1) {} else {
            setCountLinks(countArr)
            subLinksArray()
        }
    }
    const subLinksArray = () => {
        let linksArr = [...links]
        linksArr.pop()
        setLinks(linksArr)
    }

    return(
<div>
    {countLinks.map((item, index) => {
        return (
            <Row key={item} className="mb-2">
                <Form.Control
                    key={"LinkName" + index}
                    className='me-1'
                    type='linkName'
                    placeholder='Link'
                    style={{
                        width: '15%'
                    }}
                    onChange={(e) => {
                        handleLinkNameChange(index, e.target.value)
                        // if(e.target.value !== ''){   setTeamMemberNameError(false) }
                    }}
                    label='LINK NAME'/>
                <Form.Control
                    key={"LinkURL" + index}
                    className='me-1'
                    type='linkURL'
                    placeholder='Link URL'
                    style={{
                        width: '45%'
                    }}
                    onChange={(e) => {
                        handleLinkURLChange(index, e.target.value)
                        // if(e.target.value !== ''){   setTeamMemberEmailError(false) }
                    }}
                    label='Link URL'/>
            </Row>

        );
    })
    }
    </div>
    );
}

export default InputLinks;