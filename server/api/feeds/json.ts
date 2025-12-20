import type { Feed } from '~/types/feed'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  // Extract date filter parameters
  const before = query.before as string | undefined
  const after = query.after as string | undefined
  
  // Validate and parse dates
  let afterDate: Date | undefined
  let beforeDate: Date | undefined
  
  if (after) {
    afterDate = new Date(after)
    if (isNaN(afterDate.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid after date format'
      })
    }
  }
  
  if (before) {
    beforeDate = new Date(before)
    if (isNaN(beforeDate.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid before date format'
      })
    }
  }
  
  // Validate date range
  if (afterDate && beforeDate && beforeDate < afterDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'before date cannot be earlier than after date'
    })
  }

  try {
    const response = await $fetch<Feed[]>(config.feedUrl)
    
    // Apply date filtering if dates are provided
    let filteredFeeds = response
    
    if (afterDate || beforeDate) {
      filteredFeeds = response.filter((feed) => {
        const feedDate = new Date(feed.date)
        
        if (afterDate && feedDate < afterDate) {
          return false
        }
        
        if (beforeDate && feedDate > beforeDate) {
          return false
        }
        
        return true
      })
    }
    
    return filteredFeeds
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch feeds'
    })
  }
})