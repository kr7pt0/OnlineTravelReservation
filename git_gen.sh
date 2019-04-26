if [ -z "$1" ]
  then
    echo "No argument supplied"
  else
    commit_regex='^commit'
    commit_find_str='commit '
    commit_replace_str=''
    date_regex='^Date:   '
    date_find_str='Date:   '
    date_replace_str=''
    rm -f temp.txt
    touch temp.txt
    git log > temp.txt
    touch run_git.sh

    date_diff="$1"
    echo "git filter-branch --env-filter \ '" > ./run_git.sh

    while IFS='' read -r line || [[ -n "$line" ]]; do
      if [[ $line =~ $commit_regex ]]; then
        commit_num="${line/$commit_find_str/$commit_replace_str}"
        echo "if [ \$GIT_COMMIT = $commit_num ]" >> ./run_git.sh
        echo 'then' >> ./run_git.sh
      fi
      if [[ $line =~ $date_regex ]]; then
        commit_date="${line/$date_find_str/$date_replace_str}"
        commit_date="$(date -j -f "%a %b %d %T %Y %z" "$commit_date" "+%s")"
        commit_date=$((commit_date + date_diff * 3600 * 24))
        echo 'echo $GIT_AUTHOR_DATE' >> ./run_git.sh
        echo "export GIT_AUTHOR_DATE=$commit_date" >> ./run_git.sh
        echo "export GIT_COMMITTER_DATE=$commit_date" >> ./run_git.sh
        echo 'fi' >> ./run_git.sh
      fi
    done < temp.txt
    echo "' -f" >> ./run_git.sh
    rm -f temp.txt
    chmod +x ./run_git.sh
    # ./run_git.sh
    # rm -f run_git.sh
fi

# how to run
# ./git_gen.sh 300
# ./run_git.sh
# rm -f run_git.sh

