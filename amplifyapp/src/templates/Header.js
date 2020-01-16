import React from 'react'

export default function Header() {
    return (
        <header className="main-header">
            <div>
                {/* <span>Hallo wereld</span> */}
                <img className="main-header__brand" src={require("../static/Deloitte-logo-black.svg")} alt="Deloitte assignment" />

            </div>
        </header>

    )
}
