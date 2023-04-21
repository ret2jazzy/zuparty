import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'

const Header = () => {
  const router = useRouter();
  return (
    <HeaderContainer>
      <Logo src="/images/zuparty-logo.png" alt="Zuzalu" width="160" height="42"
        onClick={() => router.push('/')} />
    </HeaderContainer>
  )
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`

const Logo = styled.img`
  cursor: pointer;
`

export default Header