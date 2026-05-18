import { Flex, Text, Tooltip, Badge } from '@chakra-ui/react'

import {
    DarkModeToggle,
    ExportProgress,
    ImportProgress,
    UserAuth,
} from '../icons/ProjectIcons.jsx'

const Headings = ({ data, setData, user }) => {
    const isDarkMode = data.data.header.darkMode
    const isAdmin = user?.email === 'mayankrajdto@gmail.com'
    return (
        <Flex
            className={'headings'}
            w={'100vw'}
            px={6}
            mt={4}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
        >
            <DarkModeToggle data={data} setData={setData} toShow={false} />
            <Flex flexGrow={1} align="center" justify="center" position="relative">
                <Text
                    fontWeight={'900'}
                    fontSize={'5xl'}
                    fontFamily={'customFamily'}
                    color={isDarkMode ? 'white' : 'gray.800'}
                    textShadow={isDarkMode ? '0 0 30px rgba(243, 198, 35, 0.3)' : 'none'}
                    letterSpacing="-1.5px"
                >
                    DSA <span style={{ color: '#F3C623' }}>Safari</span>
                </Text>
                {isAdmin && (
                    <Badge 
                        variant="solid" 
                        bg="#F3C623" 
                        color="black" 
                        ml={3} 
                        fontSize="10px" 
                        fontWeight="900" 
                        borderRadius="4px"
                        boxShadow="0 0 15px rgba(243, 198, 35, 0.5)"
                    >
                        PRO
                    </Badge>
                )}
            </Flex>
            <Flex alignItems={'center'} gap={4}>
                <UserAuth user={user} />
                <DarkModeToggle data={data} setData={setData} toShow={true} />
            </Flex>
        </Flex>
    )
}


export default Headings

