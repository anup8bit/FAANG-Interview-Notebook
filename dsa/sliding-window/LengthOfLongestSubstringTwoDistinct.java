/**
 * https://neetcode.io/problems/longest-substring-with-at-most-two-distinct-characters/
 */

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class LengthOfLongestSubstringTwoDistinct {
    public int lengthOfLongestSubstringTwoDistinct(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int startIndex = 0;
        int maxLen = 0;

        for (int i = 0; i < s.length(); i++) {
            if (map.containsKey(s.charAt(i))) {
                map.put(s.charAt(i), i);
            } else {
                if (map.size() == 2) { // validation of window
                
                    // char which occured before last time should be removed from map
                    int len = i - startIndex;
                    if (len > maxLen) {
                        maxLen = len;
                    }
                    Iterator<Character> it = map.keySet().iterator();
                    Character key1 = it.next();
                    Character key2 = it.next();

                    // Compare values associated with the keys
                    if (map.get(key1) < map.get(key2)) {
                        startIndex = map.get(key1)+1;
                        map.remove(key1);
                    } else {
                        startIndex = map.get(key2)+1;
                        map.remove(key2);
                    }
                }
                map.put(s.charAt(i), i);
            }
        }

        int len = s.length() - startIndex;
        if (len > maxLen) {
            maxLen = len;
        }

        return maxLen;
    }
}


/**
 * varient :
 *      window must only contains two distinc charcters
 *      if 3rd element comes up then we have to remove the element which occured later last time
 * 
 *     Ex -> ababbbaaaaac -> b occurs later than a for last time, so b should be discarded from next sliding window
 */

