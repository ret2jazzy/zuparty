import React from 'react'
import styled from 'styled-components'

const Header = () => {
  return (
    <HeaderContainer>
      <img src="/images/zuparty-logo.png" alt="Zuzalu" width="160" height="42" />
    </HeaderContainer>
  )
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`
export default Header