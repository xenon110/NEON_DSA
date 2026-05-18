import { Flex } from '@chakra-ui/react'
import { useState } from 'react'

import Content from './content/Content.jsx'
import Footer from './footer/Footer.jsx'
import Header from './header/Header.jsx'

const DSA = ({ data, setData, isHomeScreen, selectedContentIndex, user, subscription }) => {
    let [searchValue, setSearchValue] = useState('')
    const isDarkMode = data.data.header.darkMode
    return (
        <Flex
            className={'app'}
            w={'100vw'}
            h={'100vh'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
            bg={isDarkMode ? 'fullPageColor_dark' : 'fullPageColor'}
        >
            <Header
                data={data}
                setData={setData}
                isHomeScreen={isHomeScreen}
                selectedContentIndex={selectedContentIndex}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                user={user}
                subscription={subscription}
            />
            <Content
                data={data}
                setData={setData}
                isHomeScreen={isHomeScreen}
                selectedContentIndex={selectedContentIndex}
                searchValue={searchValue}
                user={user}
                subscription={subscription}
            />
            <Footer data={data} />
        </Flex>
    )
}


export default DSA
