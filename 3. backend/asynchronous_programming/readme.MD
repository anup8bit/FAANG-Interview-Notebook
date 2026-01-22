

### Using isAlive( ) and join( )

***Two ways exist to determine whether a thread has finished: ***
1. First, you can call ***isAlive( )*** on the thread. This method is defined by Thread, and its general form is shown here:
final boolean isAlive( )

The isAlive( ) method returns true if the thread upon which it is called is still running. It
returns false otherwise.


While isAlive( ) is occasionally useful, the method that you will more commonly use to
wait for a thread to finish is called join( ), shown here:

***2. join()***

- final void join( ) throws InterruptedException
- join() method waits until the thread on which it is called terminates.
- Additional forms of join( ) allow you to specify a maximum amount of time that you want to wait for the specified thread to terminate.