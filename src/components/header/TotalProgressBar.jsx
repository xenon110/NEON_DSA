import { Flex, Text, Box } from '@chakra-ui/react'

const TotalProgressBar = ({ data }) => {
    const isDarkMode = data.data.header.darkMode
    const completedQuestions = data.data.header.completedQuestions
    const percentageCompleted = (
        (data.data.header.completedQuestions /
            data.data.header.totalQuestions) *
        100
    ).toFixed(1)
    return (
        <Flex
            className={'totalProgressBar'}
            mt={6}
            flexDirection={'column'}
            alignItems={'center'}
            w="100%"
        >
            <Text
                align={'center'}
                fontWeight={'800'}
                fontSize={{ base: 'xs', md: 'md' }}
                fontFamily={'customFamily'}
                color={isDarkMode ? 'gray.300' : 'gray.600'}
                letterSpacing="1px"
                mb={3}
                textTransform="uppercase"
            >
                Total Progress: {' '}
                <span style={{ color: '#F3C623' }}>{completedQuestions}</span> Solved ({percentageCompleted}%)
            </Text>

            <Box
                h={'10px'}
                w={'70vw'}
                bg={isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
                borderRadius="full"
                overflow="hidden"
                position="relative"
                border={isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'}
            >
                <Box
                    h="100%"
                    w={percentageCompleted + '%'}
                    bg="#F3C623"
                    borderRadius="full"
                    transition="width 1s cubic-bezier(0.65, 0, 0.35, 1)"
                    boxShadow="0 0 15px rgba(243, 198, 35, 0.5)"
                />
            </Box>
        </Flex>
    )
}

export default TotalProgressBar
