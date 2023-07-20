import React from 'react'

interface HeadingProps {
    title: string,
    desc: string
}

const Heading: React.FC<HeadingProps> = ({ title, desc }) => {
    return (
        <div>
            <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
            <p className='text-sm text-muted-foreground'>{desc}</p>

        </div>
    )
}

export default Heading