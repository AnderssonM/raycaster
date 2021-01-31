Git Work flow
-------------

  - **First**

        git branch branchx
        git checkout branchx
  - **Then**

    ... do work, commit (into branchx), repeat...

        git checkout master   # return to master
        git log branchx  # to find out the ID of the commit to merge back
        git cherry-pick <commit ID from branchx>

    That's the preferred approach. 

    This implies that you should keep this in mind while working in your experimental branch. Your commits should be small enough to include only the files that are involved in a fix/feature.


  - **Alternative, you can pick some files to merge back using**

    from branch master do:

        git checkout branchx file1 file2 file3