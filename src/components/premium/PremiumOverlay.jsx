import { Flex, Text, Icon, Box, Badge } from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'

const PremiumOverlay = () => {
    const navigate = useNavigate()

    return (
        <Flex
            position="absolute"
            inset={0}
            bg="rgba(0, 0, 0, 0.25)"
            backdropFilter="blur(5px) saturate(150%)"
            borderRadius="20px"
            direction="column"
            align="center"
            justify="center"
            zIndex={10}
            transition="all 0.5s ease"
            cursor="pointer"
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate('/checkout')
            }}
            _hover={{
                bg: "rgba(0, 0, 0, 0.15)",
                backdropFilter: "blur(3px) saturate(180%)",
                "& .premium-badge": {
                    transform: "scale(1.1)",
                    boxShadow: "0 0 30px rgba(243, 198, 35, 0.6)"
                }
            }}
        >
            <Flex
                className="premium-badge"
                direction="column"
                align="center"
                bg="rgba(13, 17, 23, 0.85)"
                py={2.5}
                px={5}
                borderRadius="20px"
                border="1px solid rgba(243, 198, 35, 0.5)"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                boxShadow="0 10px 30px rgba(0, 0, 0, 0.5)"
            >
                <Icon 
                    as={LockIcon} 
                    color="#F3C623" 
                    w={4} 
                    h={4} 
                    mb={1.5}
                    filter="drop-shadow(0 0 10px rgba(243, 198, 35, 0.4))"
                />
                <Text 
                    color="#F3C623" 
                    fontWeight="900" 
                    fontSize="10px" 
                    letterSpacing="2px"
                    textShadow="0 0 15px rgba(243, 198, 35, 0.3)"
                >
                    UPGRADE TO PRO
                </Text>
            </Flex>
            <Text 
                position="absolute"
                bottom={4}
                color="whiteAlpha.600" 
                fontSize="10px" 
                fontWeight="700" 
                letterSpacing="1px"
            >
                UNLOCK ALL 450+ PROBLEMS
            </Text>
        </Flex>
    )
}

export default PremiumOverlay
