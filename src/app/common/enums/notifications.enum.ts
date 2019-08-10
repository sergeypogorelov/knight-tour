export enum Notifications {
    /**
     * notifies the search has run into a error
     */
    SearchError,

    /**
     * notifies the search has been started
     */
    SearchStarted,
    
    /**
     * notifies the search has been stopped
     */
    SearchStopped,

    /**
     * notifies about the search progress
     */
    SearchProgress,

    /**
     * notifies about a found solution
     */
    SearchResult
}
