
# ThreadLocal 的使用：



## 介绍




## 代码记录

```java

public abstract class ThreadContext {

	private static final String SUBJECT_KEY = "sybject";
	private static final String USER_ID_KEY = "userIdKey";
	private static final ThreadLocal<Map<Object, Object>> threadLocal = new InheritableThreadLocalMap<Map<Object, Object>>();
	
	public static Map<Object, Object> getResources() {
        if (threadLocal.get() == null){
            return new HashMap<Object, Object>();
        } else {
            return new HashMap<Object, Object>(threadLocal.get());
        }
    }
	
	public static void setResources(Map<Object, Object> newResources) {
        if (newResources==null||newResources.isEmpty()) {
            return;
        }
        ensureThreadLocalInitialized();
        threadLocal.get().clear();
        threadLocal.get().putAll(newResources);
    }
	
	private static void ensureThreadLocalInitialized(){
        if (threadLocal.get() == null){
        	threadLocal.set(new HashMap<Object, Object>());
        }
    }

    public static Object getValue(Object key) {
        Map<Object, Object> perThreadResources = threadLocal.get();
        return perThreadResources != null ? perThreadResources.get(key) : null;
    }
	
	public static void put(Object key, Object value) {
        if (key == null) {
            throw new IllegalArgumentException("key cannot be null");
        }

        if (value == null) {
            remove(key);
            return;
        }

        ensureThreadLocalInitialized();
        threadLocal.get().put(key, value);

    }
	
	public static Object remove(Object key) {
        Map<Object, Object> perThreadResources = threadLocal.get();
        Object value = perThreadResources != null ? perThreadResources.remove(key) : null;
        return value;
    }
	
	public static void remove() {
		threadLocal.remove();
    }
	
	public static void  bindingSubject(Subject subject) {
		if(subject!=null) {
			put(SUBJECT_KEY,subject);
		}
	}
	
	public static Subject getSubject() {
		return (Subject)getValue(SUBJECT_KEY);
	}
	
	public static void  bindingUserId(String userId) {
		if(userId!=null&&!"".equals(userId)) {
			put(USER_ID_KEY,userId);
		}
	}
	
	public static String getUserId() {
		return (String)getValue(USER_ID_KEY);
	}
	
	private static final class InheritableThreadLocalMap<T extends Map<Object, Object>> extends InheritableThreadLocal<Map<Object, Object>> {

        @Override
        protected Map<Object, Object> childValue(Map<Object, Object> parentValue) {
            if (parentValue != null) {
                return (Map<Object, Object>) ((HashMap<Object, Object>) parentValue).clone();
            } else {
                return null;
            }
        }
    }
}

```