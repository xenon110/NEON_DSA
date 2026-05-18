import './ProgressBar.css'

import {
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Text,
    Box,
    Icon,
    Badge
} from '@chakra-ui/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@chakra-ui/icons'
import PremiumOverlay from '../premium/PremiumOverlay'

const SingleTopic = ({ data, selectedContentIndex, user, subscription }) => {
    const [isHovering, setHover] = useState(false)

    const isDarkMode = data.data.header.darkMode
    const current = data.data.content[selectedContentIndex]
    const completedQuestion = current.contentCompletedQuestions
    const totalQuestion = current.contentTotalQuestions
    const completedPercentage = (completedQuestion / totalQuestion) * 100
    const topicLink = current.contentPath
    const isStarted = current.contentCompletedQuestions !== 0
    const contentHeading = current.contentHeading
    const contentSubHeading = current.contentSubHeading

    const isAdmin = user?.email === 'mayankrajdto@gmail.com' || subscription?.plan_type === 'admin'
    const isPremium = subscription?.status === 'active'
    const isLocked = !isAdmin && !isPremium && selectedContentIndex > 1

    const TopicContent = (
        <Flex
            className={'singleTopic'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            background={
                isStarted
                    ? isDarkMode
                        ? 'linear-gradient(135deg, rgba(243, 198, 35, 0.15), rgba(243, 198, 35, 0.05))'
                        : 'linear-gradient(135deg, #f0f7ff, #e3f2fd)'
                    : isDarkMode
                    ? 'rgba(25, 25, 25, 0.7)'
                    : 'rgba(255, 255, 255, 0.9)'
            }
            border="1px solid"
            borderColor={
                isStarted 
                ? 'rgba(243, 198, 35, 0.3)' 
                : isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'gray.200'
            }
            p={6}
            minH={'140px'}
            borderRadius={24}
            cursor={isLocked ? 'default' : 'pointer'}
            onMouseEnter={() => {
                if (!isLocked) setHover(true)
            }}
            onMouseLeave={() => {
                if (!isLocked) setHover(false)
            }}
            transform={isHovering ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)'}
            boxShadow={
                isHovering 
                ? isDarkMode ? '0 25px 50px rgba(0, 0, 0, 0.6)' : '0 25px 50px rgba(0, 0, 0, 0.15)'
                : '0 4px 12px rgba(0, 0, 0, 0.05)'
            }
            transition={'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)'}
            position="relative"
            overflow="hidden"
        >
            {/* Background Accent for Unlocked */}
            {!isLocked && isDarkMode && (
                <Box
                    position="absolute"
                    top="-10%"
                    right="-10%"
                    w="150px"
                    h="150px"
                    bg="radial-gradient(circle, rgba(243, 198, 35, 0.05) 0%, transparent 70%)"
                    pointerEvents="none"
                />
            )}

            <Flex
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'start'}
                zIndex={1}
                maxW="70%"
            >
                <Badge 
                    mb={3}
                    bg={isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'gray.100'}
                    color={isDarkMode ? 'gray.400' : 'gray.500'}
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="9px"
                    fontWeight="900"
                    letterSpacing="1px"
                >
                    {totalQuestion} PROBLEMS
                </Badge>
                <Text
                    fontWeight={'900'}
                    fontSize={'2xl'}
                    fontFamily={'customFamily'}
                    color={isDarkMode ? 'white' : 'gray.800'}
                    letterSpacing="-0.5px"
                    lineHeight="1.2"
                >
                    {contentHeading}
                </Text>
                <Text
                    mt={2}
                    fontWeight={'700'}
                    fontSize={'xs'}
                    fontFamily={'customFamily'}
                    color={isDarkMode ? 'gray.500' : 'gray.500'}
                    letterSpacing="0.2px"
                    noOfLines={1}
                >
                    {contentSubHeading || 'Master standard patterns'}
                </Text>
            </Flex>

            <Flex align="center" zIndex={1}>
                {isStarted ? (
                    <Box position="relative">
                        <CircularProgress
                            size={'70px'}
                            thickness={'8px'}
                            color="#F3C623"
                            trackColor={isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
                            value={completedPercentage}
                        >
                            <CircularProgressLabel
                                fontSize="xs"
                                fontWeight="900"
                                color={isDarkMode ? 'white' : 'gray.700'}
                            >
                                {Math.round(completedPercentage)}%
                            </CircularProgressLabel>
                        </CircularProgress>
                    </Box>
                ) : !isLocked && (
                    <Flex
                        w={'44px'}
                        h={'44px'}
                        bg="#F3C623"
                        borderRadius={'14px'}
                        align="center"
                        justify="center"
                        transition="all 0.3s ease"
                        _hover={{
                            transform: 'rotate(90deg)',
                            bg: 'white',
                            color: '#F3C623'
                        }}
                        boxShadow="0 10px 20px rgba(243, 198, 35, 0.3)"
                    >
                        <Icon as={ChevronRightIcon} w={6} h={6} color={isHovering ? '#F3C623' : 'black'} />
                    </Flex>
                )}
            </Flex>

            {isLocked && <PremiumOverlay />}
        </Flex>
    )

    if (isLocked) {
        return TopicContent
    }

    return (
        <Link to={topicLink}>
            {TopicContent}
        </Link>
    )
}

export default SingleTopic
