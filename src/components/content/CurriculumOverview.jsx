import { Flex, Text, Grid, Box, Icon, Badge } from '@chakra-ui/react'
import { CheckCircleIcon, LockIcon } from '@chakra-ui/icons'

const CurriculumOverview = ({ data, user, subscription }) => {
    const isDarkMode = data.data.header.darkMode
    const topics = data.data.content
    const isAdmin = user?.email === 'mayankrajdto@gmail.com' || subscription?.plan_type === 'admin'
    const isPremium = subscription?.status === 'active'

    return (
        <Flex
            direction="column"
            w="100%"
            mt={12}
            mb={8}
            p={8}
            bg={isDarkMode ? 'rgba(20, 20, 20, 0.4)' : 'gray.50'}
            borderRadius="30px"
            border="1px solid"
            borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'gray.200'}
            backdropFilter="blur(10px)"
        >
            <Flex justify="space-between" align="center" mb={8}>
                <Box>
                    <Text
                        fontSize="3xl"
                        fontWeight="900"
                        color={isDarkMode ? 'white' : 'gray.800'}
                        letterSpacing="-1px"
                    >
                        What's Inside?
                    </Text>
                    <Text color="gray.500" fontWeight="600" fontSize="sm">
                        Total 18 Modules • 450+ High-Impact Problems
                    </Text>
                </Box>
                {!isAdmin && (
                    <Badge 
                        bg="#F3C623" 
                        color="black" 
                        px={4} 
                        py={2} 
                        borderRadius="full" 
                        fontSize="xs" 
                        fontWeight="800"
                        boxShadow="0 0 20px rgba(243, 198, 35, 0.3)"
                    >
                        LIMITED ACCESS
                    </Badge>
                )}
            </Flex>

            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={4}
            >
                {topics.map((topic, index) => {
                    const isLocked = !isAdmin && !isPremium && index > 1
                    return (
                        <Flex
                            key={index}
                            p={4}
                            bg={isDarkMode ? 'rgba(30, 30, 30, 0.4)' : 'white'}
                            borderRadius="20px"
                            align="center"
                            justify="space-between"
                            border="1px solid"
                            borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'gray.100'}
                            transition="all 0.3s ease"
                            _hover={{ transform: 'translateX(5px)', borderColor: isLocked ? 'rgba(255, 255, 255, 0.1)' : '#F3C623' }}
                        >
                            <Flex align="center">
                                <Flex
                                    w="36px"
                                    h="36px"
                                    bg={isLocked ? 'rgba(255, 255, 255, 0.05)' : 'rgba(243, 198, 35, 0.1)'}
                                    borderRadius="12px"
                                    align="center"
                                    justify="center"
                                    mr={3}
                                >
                                    <Text 
                                        fontWeight="900" 
                                        fontSize="xs" 
                                        color={isLocked ? 'gray.500' : '#F3C623'}
                                    >
                                        {index + 1}
                                    </Text>
                                </Flex>
                                <Box>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="800"
                                        color={isLocked ? 'gray.500' : isDarkMode ? 'white' : 'gray.800'}
                                    >
                                        {topic.contentHeading}
                                    </Text>
                                    <Text fontSize="10px" color="gray.500" fontWeight="700">
                                        {topic.contentTotalQuestions} Questions
                                    </Text>
                                </Box>
                            </Flex>
                            <Icon 
                                as={isLocked ? LockIcon : CheckCircleIcon} 
                                color={isLocked ? 'gray.600' : '#F3C623'} 
                                w={4} 
                                h={4} 
                            />
                        </Flex>
                    )
                })}
            </Grid>
        </Flex>
    )
}

export default CurriculumOverview
